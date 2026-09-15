<?php

function get_questions(): array
{
    return [
        1 => [
            'q' => 'How many players are on the field per team in a standard soccer match?',
            'options' => ['9', '10', '11', '12'],
            'answer' => 2
        ],
        2 => [
            'q' => 'What is the maximum duration of a standard professional soccer match (regulation time)?',
            'options' => ['60 minutes', '80 minutes', '90 minutes', '120 minutes'],
            'answer' => 2
        ],
        3 => [
            'q' => 'Which country has won the most FIFA World Cup titles?',
            'options' => ['Germany', 'Italy', 'Argentina', 'Brazil'],
            'answer' => 3
        ],
        4 => [
            'q' => 'What is the name of the kick used to start the game and after a goal is scored?',
            'options' => ['Goal kick', 'Kick-off', 'Corner kick', 'Throw-in'],
            'answer' => 1
        ],
        5 => [
            'q' => 'What colour card does a referee show to send a player off?',
            'options' => ['Yellow', 'Red', 'Green', 'Blue'],
            'answer' => 1
        ],
        6 => [
            'q' => 'How wide is a standard soccer goal?',
            'options' => ['7.32 m (24 ft)', '5.5 m (18 ft)', '10 m (33 ft)', '6 m (20 ft)'],
            'answer' => 0
        ],
        7 => [
            'q' => 'Which position is allowed to handle the ball inside the penalty area?',
            'options' => ['Defender', 'Midfielder', 'Goalkeeper', 'Striker'],
            'answer' => 2
        ],
        8 => [
            'q' => 'How many minutes are in extra time (each half) in most tournaments?',
            'options' => ['5', '10', '15', '20'],
            'answer' => 2
        ],
        9 => [
            'q' => 'What is it called when a player scores three goals in a single match?',
            'options' => ['Hat-trick', 'Triple', 'Three-peat', 'Perfect'],
            'answer' => 0
        ],
        10 => [
            'q' => 'Which of these is NOT a real soccer position?',
            'options' => ['Striker', 'Goalkeeper', 'Quarterback', 'Defender'],
            'answer' => 2
        ],
    ];
}
