<?php

const TIME_LIMIT = 15;

function init_game(array $questions): void
{
    if (!isset($_SESSION['quiz']) || isset($_GET['reset'])) {
        $ids = array_keys($questions);
        shuffle($ids);

        $_SESSION['quiz'] = [
            'order' => $ids,
            'index' => 0,
            'score' => 0,
            'finished' => false,
            'feedback' => '',
            'started_at' => time(),
            'saved' => false,
        ];
    }
}

function handle_score_save(array $questions): void
{
    $quiz = &$_SESSION['quiz'];

    if (!$quiz['finished']) {
        return;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        return;
    }
    if (!isset($_POST['player_name'])) {
        return;
    }

    save_score($_POST['player_name'], $quiz['score'], count($questions));
    $quiz['saved'] = true;
}

function handle_answer(array $questions): string
{
    $quiz = &$_SESSION['quiz'];

    if ($quiz['finished']) {
        return '';
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        return '';
    }
    if (isset($_POST['player_name'])) {
        return '';
    }

    $qid = (int) ($_POST['qid'] ?? 0);
    $selected = $_POST['answer'] ?? null;
    $timed_out = isset($_POST['timed_out']) && $_POST['timed_out'] === '1';

    if (!isset($quiz['order'][$quiz['index']])) {
        return '';
    }

    $current_real_id = (int) $quiz['order'][$quiz['index']];
    $total = count($questions);

    if ($current_real_id !== $qid) {
        return '';
    }
    if (!isset($questions[$qid])) {
        return '';
    }

    if ($selected === null && !$timed_out) {
        return 'Please select an answer.';
    }

    $correct_index = (int) $questions[$qid]['answer'];
    $selected_index = $selected !== null ? (int) $selected : -1;

    if ($timed_out) {
        $quiz['feedback'] = "⏰ Time's up! Correct answer: <strong>"
            . htmlspecialchars($questions[$qid]['options'][$correct_index])
            . "</strong>";
    } elseif ($selected_index === $correct_index) {
        $quiz['score']++;
        $quiz['feedback'] = '✅ Correct!';
    } else {
        $quiz['feedback'] = "❌ Wrong. Correct answer: <strong>"
            . htmlspecialchars($questions[$qid]['options'][$correct_index])
            . "</strong>";
    }

    if ($quiz['index'] < $total - 1) {
        $quiz['index']++;
        $quiz['started_at'] = time();
    } else {
        $quiz['finished'] = true;
    }

    return '';
}

function get_quiz_state(array $questions): array
{
    $quiz = &$_SESSION['quiz'];
    $total = count($questions);

    $current_qid = $quiz['finished'] ? null : $quiz['order'][$quiz['index']];
    $elapsed = time() - $quiz['started_at'];
    $remaining = max(0, TIME_LIMIT - $elapsed);

    return [
        'quiz' => $quiz,
        'total' => $total,
        'current_qid' => $current_qid,
        'remaining' => $remaining,
        'show_question' => !$quiz['finished'] && $current_qid !== null,
    ];
}

function get_result_message(int $score, int $total): string
{
    $percentage = ($score / $total) * 100;
    if ($percentage == 100) {
        return "🌟 Perfect! You're a soccer genius!";
    }
    if ($percentage >= 80) {
        return '🔥 Excellent! You really know your soccer.';
    }
    if ($percentage >= 50) {
        return '👍 Not bad! A solid performance.';
    }
    return "⚽ Keep practising — you'll get there!";
}
