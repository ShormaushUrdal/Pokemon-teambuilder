from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import Team, Pokemon, Move, Item, Ability, TeamPokemon

@login_required
def dashboard(request):
    user_teams = Team.objects.filter(user=request.user)
    context = {'teams': user_teams}
    return render(request, 'dashboard.html', context)

@login_required
def teambuilder(request):
    user_teams = Team.objects.filter(user=request.user)
    return render(request, 'teambuilder.html', {'teams': user_teams})

@login_required
def edit_team(request, team_id=None):
    if team_id:
        team = get_object_or_404(Team, id=team_id, user=request.user)
    else:
        team = None

    if request.method == 'POST':
        team_name = request.POST.get('team-name', '').strip()
        
        if not team_name:
            return render(request, 'edit-team.html', {
                'error_message': 'Team name is required.',
                'team': team,
                'pokemons': Pokemon.objects.all(),
                'moves': Move.objects.all(),
                'items': Item.objects.all(),
                'abilities': Ability.objects.all()
            })

        if team:
            team.name = team_name
            team.save()
        else:
            team = Team.objects.create(name=team_name, user=request.user)

        # Clear existing team Pokémon if updating
        if team_id:
            team.team_pokemons.all().delete()

        for i in range(1, 7):
            pokemon_name = request.POST.get(f'pokemon-name-{i}')
            if pokemon_name:
                try:
                    pokemon = Pokemon.objects.get(name=pokemon_name)
                    ability = Ability.objects.get(name=request.POST.get(f'ability-{i}'))
                    item = Item.objects.get(name=request.POST.get(f'item-{i}'))
                    
                    team_pokemon = TeamPokemon.objects.create(
                        team=team,
                        pokemon=pokemon,
                        ability=ability,
                        item=item,
                        slot=i
                    )
                    
                    for j in range(1, 5):
                        move_name = request.POST.get(f'move-{i}-{j}')
                        if move_name:
                            move = Move.objects.get(name=move_name)
                            team_pokemon.moves.add(move)
                except (Pokemon.DoesNotExist, Ability.DoesNotExist, Item.DoesNotExist, Move.DoesNotExist) as e:
                    return render(request, 'edit-team.html', {
                        'error_message': f'Error creating team: {str(e)}',
                        'team': team,
                        'pokemons': Pokemon.objects.all(),
                        'moves': Move.objects.all(),
                        'items': Item.objects.all(),
                        'abilities': Ability.objects.all()
                    })

        return redirect('teambuilder')

    context = {
        'team': team,
        'pokemons': Pokemon.objects.all(),
        'moves': Move.objects.all(),
        'items': Item.objects.all(),
        'abilities': Ability.objects.all()
    }
    return render(request, 'edit-team.html', context)

@login_required
def get_team_details(request, team_id):
    team = get_object_or_404(Team, id=team_id, user=request.user)
    team_pokemons = team.team_pokemons.all().order_by('slot')
    
    team_data = {
        'id': team.id, 
        'name': team.name,
        'pokemons': [{
            'name': tp.pokemon.name,
            'ability': tp.ability.name,
            'item': tp.item.name,
            'moves': [move.name for move in tp.moves.all()]
        } for tp in team_pokemons]
    }
    
    return JsonResponse(team_data)

@login_required
def get_all_pokemons(request):
    pokemons = Pokemon.objects.values('name')
    return JsonResponse({'pokemons': list(pokemons)})

@login_required
def get_pokemon_details(request, pokemon_name):
    try:
        pokemon = Pokemon.objects.get(name=pokemon_name)
        moves = pokemon.moves.values('name')
        abilities = pokemon.abilities.values('name')
        data = {
            'moves': list(moves),
            'abilities': list(abilities),
            'sprite_url': pokemon.sprite_url
        }
        return JsonResponse(data)
    except Pokemon.DoesNotExist:
        return JsonResponse({'error': 'Pokemon not found'}, status=404)