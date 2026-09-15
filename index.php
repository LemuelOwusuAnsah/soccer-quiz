<?php
session_start();

require_once __DIR__ . '/includes/questions.php';
require_once __DIR__ . '/includes/leaderboard.php';
require_once __DIR__ . '/includes/game.php';
require_once __DIR__ . '/includes/render.php';

$questions = get_questions();

init_game($questions);

$message = '';
if ($_SESSION['quiz']['finished']) {
    handle_score_save($questions);
} else {
    $message = handle_answer($questions);
}

$state = get_quiz_state($questions);
$leaderboard = get_leaderboard();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>⚽ Soccer Quiz</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<div class="game-container">
    <?php render_header($state); ?>

    <?php if ($message): ?>
        <div class="error-msg"><?= htmlspecialchars($message) ?></div>
    <?php endif; ?>

    <?php if ($state['quiz']['finished']): ?>
        <?php render_result($state, $leaderboard); ?>
    <?php elseif ($state['show_question']): ?>
        <?php render_question($questions[$state['current_qid']], $state['current_qid']); ?>
        <?php if ($state['quiz']['feedback']): ?>
            <div class="feedback"><?= $state['quiz']['feedback'] ?></div>
            <?php $_SESSION['quiz']['feedback'] = ''; ?>
        <?php endif; ?>
    <?php else: ?>
        <div class="error-msg">Something went wrong. <a href="?reset=1">Restart</a></div>
    <?php endif; ?>

    <div style="text-align: center; margin-top: 1.5rem;">
        <a href="?reset=1" class="reset-link">↻ Reset game</a>
    </div>
</div>

<?php if ($state['show_question']): ?>
<script>
    let secondsLeft = <?= (int) $state['remaining'] ?>;
    let paused = false;

    const timerEl = document.getElementById('timer');
    const timerValue = document.getElementById('timer-value');
    const form = document.getElementById('quiz-form');
    const timedOutInput = document.getElementById('timed_out');
    const pauseBtn = document.getElementById('pause-btn');
    const submitBtn = document.getElementById('submit-btn');

    setInterval(() => {
        if (paused) return;
        secondsLeft--;
        if (secondsLeft < 0) secondsLeft = 0;
        timerValue.textContent = secondsLeft;
        if (secondsLeft <= 5) timerEl.classList.add('warning');
        if (secondsLeft <= 0) {
            timedOutInput.value = '1';
            form.submit();
        }
    }, 1000);

    function togglePause() {
        paused = !paused;

        if (paused) {
            pauseBtn.textContent = '▶ Resume';
            pauseBtn.classList.add('paused');
            timerEl.classList.add('paused');
            submitBtn.disabled = true;
            form.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = true);
        } else {
            pauseBtn.textContent = '⏸ Pause';
            pauseBtn.classList.remove('paused');
            timerEl.classList.remove('paused');
            submitBtn.disabled = false;
            form.querySelectorAll('input[type="radio"]').forEach(r => r.disabled = false);
        }
    }
</script>
<?php endif; ?>
</body>
</html>
