from django.db import models
import random

class Game(models.Model):
    STATUS_CHOICES = [
        ('In Progress', 'In Progress'),
        ('Won', 'Won'),
        ('Lost', 'Lost'),
    ]
    WORDS = ["Hangman", "Python", "Audacix", "Bottle", "Pen"]

    word = models.CharField(max_length=11)
    word_state = models.CharField(max_length=11)
    incorrect_guesses = models.IntegerField(default=0)
    status = models.CharField(max_length=11, choices=STATUS_CHOICES, default='InProgress')
    created_time = models.DateTimeField(auto_now_add=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.word:
            self.word = random.choice(self.WORDS)
            self.word_state = '_' * len(self.word)

    def get_incorrect_guesses_remaining(self):
        return (len(self.word) // 2) - self.incorrect_guesses

    def make_guess(self, letter):
        letter = letter.upper()

        if self.status != 'InProgress':
            return False, "Game is already finished"
        
        if letter in self.word.upper():
            new_state = list(self.word_state)
            for i, char in enumerate(self.word.upper()):
                if char == letter:
                    new_state[i] = self.word[i]
            self.word_state = ''.join(new_state)
            if '_' not in self.word_state:
                self.status = 'Won'
            self.save()
            return True, "Correct guess!"
        
        else:
            self.incorrect_guesses += 1
            if self.incorrect_guesses >= len(self.word) // 2:
                self.status = 'Lost'
                self.save()
                return False, "Game Over! You Lost! Please run new game"
        self.save()
        return False, "Incorrect guess!"

    def __str__(self):
        return f"Game {self.id}: {self.word} ({self.status})"
