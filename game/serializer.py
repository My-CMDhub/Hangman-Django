from rest_framework import serializers
from .models import Game

class GameSerializer(serializers.ModelSerializer):
    incorrect_guesses_remaining = serializers.SerializerMethodField()

    class Meta:
        model = Game
        fields = ['id', 'word_state', 'incorrect_guesses', 'incorrect_guesses_remaining', 'status']
        read_only_fields = ['id', 'word_state', 'incorrect_guesses', 'status']

    def get_incorrect_guesses_remaining(self, obj):
        return obj.get_incorrect_guesses_remaining()

class GuessSerializer(serializers.Serializer):
    letter = serializers.CharField(max_length=1, min_length=1) 