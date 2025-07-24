from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Game
from .serializer import GameSerializer, GuessSerializer

@api_view(['POST'])
def new_game(request):
    game = Game()
    game.save()
    return Response({'game_id': game.id}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def game_state(request, game_id):
    game = get_object_or_404(Game, id=game_id)
    serializer = GameSerializer(game)
    return Response(serializer.data)

@api_view(['POST'])
def make_guess(request, game_id):
    game = get_object_or_404(Game, id=game_id)
    guess_serializer = GuessSerializer(data=request.data)
    if not guess_serializer.is_valid():
        return Response(guess_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    letter = guess_serializer.validated_data['letter']
    is_correct, message = game.make_guess(letter)
    game.save()
    game_serializer = GameSerializer(game)
    return Response({
        'correct_guess': is_correct,
        'message': message,
        **game_serializer.data
    })

def hangman_page(request):
    return render(request, 'index.html')
