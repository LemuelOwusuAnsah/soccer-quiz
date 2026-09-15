<?php

function get_scores_file(): string
{
    return __DIR__ . '/../scores.json';
}

function load_scores(): array
{
    $file = get_scores_file();
    if (!file_exists($file)) {
        return [];
    }
    $raw = file_get_contents($file);
    if ($raw === '' || $raw === false) {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function save_score(string $name, int $score, int $total): void
{
    $name = trim($name);
    if ($name === '') {
        $name = 'Anonymous';
    }
    $name = htmlspecialchars(substr($name, 0, 20));

    $entry = [
        'name' => $name,
        'score' => $score,
        'total' => $total,
        'date' => date('Y-m-d H:i'),
    ];

    $scores = load_scores();
    $scores[] = $entry;

    usort($scores, function ($a, $b) {
        if ((int) $b['score'] === (int) $a['score']) {
            return strcmp($a['date'], $b['date']);
        }
        return (int) $b['score'] <=> (int) $a['score'];
    });

    $scores = array_slice($scores, 0, 5);
    file_put_contents(get_scores_file(), json_encode($scores, JSON_PRETTY_PRINT));
}

function get_leaderboard(): array
{
    return load_scores();
}
