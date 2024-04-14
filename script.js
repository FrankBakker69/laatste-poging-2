document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById('game-container');
    const ball = document.getElementById('ball');
    const goal = document.getElementById('goal');
    const obstacles = document.querySelectorAll('.obstacle');
    const levelDisplay = document.getElementById('level-display');
    let currentLevel = 1;

    // Plaats de bal, doel en obstakels op willekeurige posities binnen het game-container
    function placeElementsRandomly() {
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;

        // Plaats bal
        ball.style.top = Math.random() * (containerHeight - ball.clientHeight) + 'px';
        ball.style.left = Math.random() * (containerWidth - ball.clientWidth) + 'px';

        // Plaats doel
        goal.style.top = Math.random() * (containerHeight - goal.clientHeight) + 'px';
        goal.style.left = Math.random() * (containerWidth - goal.clientWidth) + 'px';

        // Plaats obstakels
        obstacles.forEach(obstacle => {
            obstacle.style.top = Math.random() * (containerHeight - obstacle.clientHeight) + 'px';
            obstacle.style.left = Math.random() * (containerWidth - obstacle.clientWidth) + 'px';
        });
    }

    // Beweeg obstakels binnen het game-container
    function moveObstacles() {
        obstacles.forEach(obstacle => {
            const obstacleRect = obstacle.getBoundingClientRect();
            const containerRect = gameContainer.getBoundingClientRect();

            let newX = obstacleRect.left - 1; // Beweeg naar links met snelheid van 1px/frame
            if (newX + obstacleRect.width < 0) {
                newX = containerRect.width; // Reset naar rechts als uit het scherm
            }

            obstacle.style.left = newX + 'px';
        });
    }

    // Start het bewegen van obstakels met interval
    setInterval(moveObstacles, 10); // Beweeg elke 10 milliseconden

    // Update niveau-display met huidige level
    function updateLevelDisplay() {
        levelDisplay.textContent = `Level: ${currentLevel}`;
    }

    // Controleer winvoorwaarde (bereik het doel)
    function checkGoalCollision() {
        const ballRect = ball.getBoundingClientRect();
        const goalRect = goal.getBoundingClientRect();

        if (!(ballRect.right < goalRect.left ||
              ballRect.left > goalRect.right ||
              ballRect.bottom < goalRect.top ||
              ballRect.top > goalRect.bottom)) {
            // Win: ga naar volgend level
            currentLevel++;
            updateLevelDisplay();
            const nextLevel = currentLevel + 1;
            alert(`Gefeliciteerd! Je mag naar level ${currentLevel}. Op naar level ${nextLevel}!`);
            placeElementsRandomly(); // Nieuwe posities voor bal, doel en obstakels
        }
    }

    // Controleer verliesvoorwaarde (bal raakt rand van game-container)
    function checkLossCondition() {
        const ballRect = ball.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();

        if (ballRect.left < containerRect.left ||
            ballRect.right > containerRect.right ||
            ballRect.top < containerRect.top ||
            ballRect.bottom > containerRect.bottom) {
            // Verlies: bal raakt de rand van het game-container
            alert('Helaas! Je hebt verloren. Probeer het opnieuw.');
            currentLevel = 1;
            updateLevelDisplay();
            placeElementsRandomly(); // Nieuw spel starten
        }
    }

    // Event listener voor balbeweging (pijltjestoetsen)
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const ballStyle = getComputedStyle(ball);
        let ballLeft = parseInt(ballStyle.left);
        let ballTop = parseInt(ballStyle.top);
        const step = 10;

        switch (key) {
            case 'ArrowUp':
                ballTop = Math.max(ballTop - step, 0);
                break;
            case 'ArrowDown':
                ballTop = Math.min(ballTop + step, gameContainer.clientHeight - ball.clientHeight);
                break;
            case 'ArrowLeft':
                ballLeft = Math.max(ballLeft - step, 0);
                break;
            case 'ArrowRight':
                ballLeft = Math.min(ballLeft + step, gameContainer.clientWidth - ball.clientWidth);
                break;
        }

        ball.style.top = ballTop + 'px';
        ball.style.left = ballLeft + 'px';

        checkGoalCollision(); // Controleer of het doel is bereikt
        checkLossCondition(); // Controleer of verliesvoorwaarde is voldaan
    });

    // Initialiseer het spel
    placeElementsRandomly();
    updateLevelDisplay();
});
