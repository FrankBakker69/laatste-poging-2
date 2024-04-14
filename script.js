document.addEventListener("DOMContentLoaded", function() {
    const gameContainer = document.getElementById('game-container');
    const ball = document.getElementById('ball');
    const goal = document.getElementById('goal');
    const levelDisplay = document.getElementById('level-display');
    let currentLevel = 1;

    // Functie om een willekeurige positie binnen het game-container te krijgen, met uitzondering van de excludePosition
    function generateUniquePosition(excludePosition) {
        const containerWidth = gameContainer.clientWidth;
        const containerHeight = gameContainer.clientHeight;
        const size = 50; // Diameter van bal en doel

        let x, y;
        do {
            x = Math.floor(Math.random() * (containerWidth - size));
            y = Math.floor(Math.random() * (containerHeight - size));
        } while (Math.abs(x - excludePosition.x) < size && Math.abs(y - excludePosition.y) < size);

        return { x, y };
    }

    // Plaats de bal en het doel op willekeurige unieke posities binnen het game-container
    function placeElementsRandomly() {
        const ballPosition = generateUniquePosition({ x: -1, y: -1 }); // Begin met een ongeldige positie
        const goalPosition = generateUniquePosition(ballPosition);

        ball.style.top = ballPosition.y + 'px';
        ball.style.left = ballPosition.x + 'px';

        goal.style.top = goalPosition.y + 'px';
        goal.style.left = goalPosition.x + 'px';
    }

    // Initialiseer het spel door de elementen op willekeurige posities te plaatsen
    placeElementsRandomly();

    // Update het niveau-display met het huidige niveau
    function updateLevelDisplay() {
        levelDisplay.textContent = `Level: ${currentLevel}`;
    }

    // Voeg event listener toe voor balbeweging
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

        // Controleer winvoorwaarde
        if (checkCollision(ball, goal)) {
            currentLevel++;
            updateLevelDisplay(); // Werk het niveau-display bij
            const nextLevel = currentLevel + 1;
            alert(`Gefeliciteerd! Je mag naar level ${currentLevel}. Op naar level ${nextLevel}!`);
            placeElementsRandomly(); // Plaats elementen opnieuw voor het volgende level
        }

        // Controleer verliesvoorwaarde (bal raakt de rand van het game-container)
        if (isOutOfBounds(ball)) {
            alert('Helaas! Je hebt verloren. Probeer het opnieuw.');
            currentLevel = 1; // Reset naar level 1 bij verlies
            updateLevelDisplay(); // Werk het niveau-display bij
            placeElementsRandomly(); // Plaats elementen opnieuw voor een nieuw spel
        }
    });

    // Controleer of de bal de rand van het game-container raakt
    function isOutOfBounds(ball) {
        const ballRect = ball.getBoundingClientRect();
        const containerRect = gameContainer.getBoundingClientRect();

        return (
            ballRect.top < containerRect.top ||
            ballRect.bottom > containerRect.bottom ||
            ballRect.left < containerRect.left ||
            ballRect.right > containerRect.right
        );
    }

    // Controleer of er een botsing is tussen de bal en het doel
    function checkCollision(ball, goal) {
        const ballRect = ball.getBoundingClientRect();
        const goalRect = goal.getBoundingClientRect();
        return !(ballRect.right < goalRect.left ||
                 ballRect.left > goalRect.right ||
                 ballRect.bottom < goalRect.top ||
                 ballRect.top > goalRect.bottom);
    }

    // Initialiseer het niveau-display
    updateLevelDisplay();
});
