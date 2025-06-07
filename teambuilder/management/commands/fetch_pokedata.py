import asyncio
import httpx
from django.core.management.base import BaseCommand
from asgiref.sync import sync_to_async
from teambuilder.models import Pokemon, Move, Ability

COMPETITIVE_ITEMS = [
    'choice-band', 'choice-scarf', 'choice-specs', 'leftovers', 'life-orb',
    'focus-sash', 'black-sludge', 'assault-vest', 'rocky-helmet', 'eviolite',
    'light-clay', 'air-balloon', 'safety-goggles', 'weakness-policy'
]

class Command(BaseCommand):
    help = 'Fetch Pokémon data from API and populate the database'

    def handle(self, *args, **kwargs):
        asyncio.run(self.fetch_and_store_data())

    async def fetch_and_store_data(self):
        async with httpx.AsyncClient() as client:
            # Fetch Pokémon data
            pokemon_api_url = 'https://pokeapi.co/api/v2/pokemon?limit=493'
            response = await self.fetch_data(pokemon_api_url, client)
            if not response:
                return
            pokemon_data = response['results']

            # Fetch all Pokémon details asynchronously
            tasks = [self.fetch_pokemon_details(pokemon['url'], client) for pokemon in pokemon_data]
            pokemon_details_list = await asyncio.gather(*tasks)

            # Process each Pokémon's details
            for pokemon_details in pokemon_details_list:
                if not pokemon_details:
                    continue

                abilities = pokemon_details['abilities']
                moves = pokemon_details['moves']

                # Save Pokémon and related abilities
                await self.save_pokemon_and_abilities(pokemon_details, abilities)

                # Fetch and save moves (skipping instantly if move details are missing)
                move_tasks = [self.fetch_move(move['move']['url'], client) for move in moves]
                move_details_list = await asyncio.gather(*move_tasks)
                await self.save_moves(pokemon_details, move_details_list)

            self.stdout.write(self.style.SUCCESS('Successfully populated Pokémon data including moves and abilities'))

    async def fetch_data(self, url, client):
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            self.stdout.write(self.style.ERROR(f"Error fetching data from {url}: {e}"))
            return None
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An unexpected error occurred: {e}"))
            return None

    async def fetch_pokemon_details(self, url, client):
        pokemon_data = await self.fetch_data(url, client)
        if not pokemon_data:
            return None

        return {
            'name': pokemon_data['name'],
            'stats': pokemon_data['stats'],
            'sprites': pokemon_data['sprites'],
            'abilities': pokemon_data['abilities'],
            'moves': pokemon_data['moves']
        }

    async def fetch_move(self, url, client):
        move_data = await self.fetch_data(url, client)
        if not move_data:
            return None

        return {
            'name': move_data['name'],
            'damage_class': move_data['damage_class'],
            'power': move_data.get('power'),
            'accuracy': move_data.get('accuracy'),
            'pp': move_data['pp'],
            'effect_entries': move_data['effect_entries']
        }

    @sync_to_async
    def save_pokemon_and_abilities(self, pokemon_details, abilities):
        stats = pokemon_details['stats']
        sprite_url = pokemon_details['sprites']['front_default']
        evs = {stat['stat']['name']: stat['effort'] for stat in stats}
        ivs = {stat['stat']['name']: 31 for stat in stats}

        p, _ = Pokemon.objects.get_or_create(
            name=pokemon_details['name'],
            sprite_url=sprite_url,
            hp=stats[0]['base_stat'],
            attack=stats[1]['base_stat'],
            defense=stats[2]['base_stat'],
            sp_attack=stats[3]['base_stat'],
            sp_defense=stats[4]['base_stat'],
            speed=stats[5]['base_stat'],
            ev_hp=evs.get('hp', 0),
            ev_attack=evs.get('attack', 0),
            ev_defense=evs.get('defense', 0),
            ev_sp_attack=evs.get('special-attack', 0),
            ev_sp_defense=evs.get('special-defense', 0),
            ev_speed=evs.get('speed', 0),
            iv_hp=ivs.get('hp', 31),
            iv_attack=ivs.get('attack', 31),
            iv_defense=ivs.get('defense', 31),
            iv_sp_attack=ivs.get('special-attack', 31),
            iv_sp_defense=ivs.get('special-defense', 31),
            iv_speed=ivs.get('speed', 31),
            level=100
        )

        for ability in abilities:
            a, _ = Ability.objects.get_or_create(name=ability['ability']['name'])
            p.abilities.add(a)

        p.save()

    @sync_to_async
    def save_moves(self, pokemon_details, move_details_list):
        p = Pokemon.objects.get(name=pokemon_details['name'])

        for move_details in move_details_list:
            if move_details:
                m, _ = Move.objects.get_or_create(
                    name=move_details['name'],
                    move_type=move_details['damage_class']['name'],
                    power=move_details.get('power'),
                    accuracy=move_details.get('accuracy'),
                    pp=move_details['pp'],
                    effect=move_details['effect_entries'][0]['effect'] if move_details['effect_entries'] else None,
                    category=move_details['damage_class']['name']
                )
                p.moves.add(m)
        p.save()

