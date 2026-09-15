<?php

function render_header(array $state): void
{
    $quiz = $state['quiz'];
    $total = $state['total'];
    $remaining = $state['remaining'];
    ?>
    <h1><span>⚽</span> Soccer Quiz</h1>
    <div class="subhead">Simple general knowledge · 10 questions · 15s each</div>

    <div class="score-bar">
        <div>🏆 Score: <?= $quiz['score'] ?> / <?= $total ?></div>
        <?php if (!$quiz['finished']): ?>
            <div class="timer <?= $remaining <= 5 ? 'warning' : '' ?>" id="timer">
                ⏱️ <span id="timer-value"><?= $remaining ?></span>s
            </div>
        <?php endif; ?>
        <div class="q-counter">
            <?php if ($quiz['finished']): ?>
                Finished
            <?php else: ?>
                Q <?= $quiz['index'] + 1 ?> / <?= $total ?>
            <?php endif; ?>
        </div>
    </div>
    <?php
}

function render_question(array $q, int $qid): void
{
    ?>
    <div class="question-box">
        <div class="question-text"><?= htmlspecialchars($q['q']) ?></div>
        <form method="POST" action="" id="quiz-form">
            <input type="hidden" name="qid" value="<?= $qid ?>">
            <input type="hidden" name="timed_out" id="timed_out" value="0">
            <div class="options">
                <?php foreach ($q['options'] as $index => $option): ?>
                    <div class="option">
                        <input type="radio" name="answer" id="opt_<?= $index ?>" value="<?= $index ?>">
                        <label for="opt_<?= $index ?>"><?= htmlspecialchars($option) ?></label>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="action-row">
                <button type="submit" class="btn" id="submit-btn">Submit Answer</button>
                <button type="button" class="btn pause-btn" id="pause-btn" onclick="togglePause()">⏸ Pause</button>
            </div>
        </form>
    </div>
    <?php
}

function render_result(array $state, array $leaderboard): void
{
    $quiz = $state['quiz'];
    $total = $state['total'];
    ?>
    <div class="result-box">
        <h2>Full Time!</h2>
        <div class="score-big"><?= $quiz['score'] ?> / <?= $total ?></div>
        <p><?= get_result_message($quiz['score'], $total) ?></p>

        <?php if (empty($quiz['saved'])): ?>
            <form method="POST" class="name-form">
                <input type="text" name="player_name" placeholder="Enter your name" maxlength="20" autofocus>
                <button type="submit">Save Score</button>
            </form>
        <?php else: ?>
            <div class="saved-badge">✅ Score saved to leaderboard!</div>
        <?php endif; ?>

        <div class="leaderboard">
            <h3>🏆 Top 5 Leaderboard</h3>
            <?php if (empty($leaderboard)): ?>
                <div class="empty">No scores yet — be the first!</div>
            <?php else: ?>
                <ol>
                    <?php foreach ($leaderboard as $entry): ?>
                        <li>
                            <span><?= htmlspecialchars($entry['name']) ?></span>
                            <span><?= (int) $entry['score'] ?>/<?= (int) $entry['total'] ?></span>
                        </li>
                    <?php endforeach; ?>
                </ol>
            <?php endif; ?>
        </div>

        <a href="?reset=1" class="btn" style="display: inline-block; text-decoration: none; width: auto; padding: 0.9rem 3rem;">Play Again</a>
    </div>
    <?php
}
