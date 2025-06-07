import asyncio
import httpx
from django.core.management.base import BaseCommand
from asgiref.sync import sync_to_async
from teambuilder.models import Pokemon
from django.db import transaction
import json
from datetime import datetime

class Command(BaseCommand):
    help = 'Fetch Pokemon sprite URLs and update the database'

    def __init__(self):
        super().__init__()
        self.sprite_log = []
        self.success_count = 0
        self.error_count = 0
        self.timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Starting sprite fetch process...'))
        asyncio.run(self.fetch_and_store_sprites())
        self.write_logs()
        
        # Print summary
        self.stdout.write(self.style.SUCCESS(f'\nProcess completed:'))
        self.stdout.write(f'Successfully updated: {self.success_count} sprites')
        self.stdout.write(self.style.ERROR(f'Errors encountered: {self.error_count} sprites'))
        self.stdout.write(f'Log file created: pokemon_sprites_{self.timestamp}.log')

    def write_logs(self):
        """Write sprite log to file"""
        if self.sprite_log:
            with open(f'pokemon_sprites_{self.timestamp}.log', 'w') as f:
                json.dump(self.sprite_log, f, indent=2)

    async def fetch_and_store_sprites(self):
        async with httpx.AsyncClient() as client:
            self.stdout.write('Fetching Pokemon list...')
            pokemon_api_url = 'https://pokeapi.co/api/v2/pokemon?limit=493'
            response = await self.fetch_data(pokemon_api_url, client)
            if not response:
                self.stdout.write(self.style.ERROR('Failed to fetch Pokemon list'))
                return
            
            pokemon_data = response['results']
            total_pokemon = len(pokemon_data)
            self.stdout.write(f'Found {total_pokemon} Pokemon to process')

            # Fetch all Pokémon sprites asynchronously
            for idx, pokemon in enumerate(pokemon_data, 1):
                try:
                    self.stdout.write(f'Processing sprite {idx}/{total_pokemon}: {pokemon["name"]}')
                    pokemon_details = await self.fetch_data(pokemon['url'], client)
                    
                    if not pokemon_details:
                        self.error_count += 1
                        continue

                    sprite_url = pokemon_details['sprites']['front_default']
                    if not sprite_url:
                        self.error_count += 1
                        self.sprite_log.append({
                            'pokemon': pokemon['name'],
                            'error': 'No sprite URL available',
                            'timestamp': datetime.now().isoformat()
                        })
                        continue

                    # Save sprite URL to database
                    await self.save_sprite(pokemon['name'], sprite_url)
                    
                    # Log success
                    self.sprite_log.append({
                        'pokemon': pokemon['name'],
                        'sprite_url': sprite_url,
                        'timestamp': datetime.now().isoformat()
                    })
                    self.success_count += 1
                    self.stdout.write(self.style.SUCCESS(f'Updated sprite for {pokemon["name"]}'))

                except Exception as e:
                    self.error_count += 1
                    self.sprite_log.append({
                        'pokemon': pokemon['name'],
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    })
                    self.stdout.write(self.style.ERROR(f'Error processing {pokemon["name"]}: {str(e)}'))

    async def fetch_data(self, url, client):
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            self.sprite_log.append({
                'url': url,
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })
            return None

    @sync_to_async
    def save_sprite(self, pokemon_name, sprite_url):
        with transaction.atomic():
            try:
                pokemon = Pokemon.objects.get(name=pokemon_name)
                pokemon.sprite_url = sprite_url
                pokemon.save(update_fields=['sprite_url'])
            except Pokemon.DoesNotExist:
                self.sprite_log.append({
                    'pokemon': pokemon_name,
                    'error': 'Pokemon not found in database',
                    'timestamp': datetime.now().isoformat()
                })