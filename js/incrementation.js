$(document).ready(function() {
    // Fonction pour mettre à jour les clics affichés
    function updateClicks() {
        $.ajax({
            url: 'https://127.0.0.1:8000/api/image/clicks', // URL pour obtenir les clics
            type: 'GET',
            success: function(response) {
                $.each(response, function(imageName, clicks) {
                    var selector = '[data-name="' + imageName + '"]'; // Sélecteur pour l'image
                    var $clickCount = $(selector).siblings('.click-count');

                    if ($clickCount.length === 0) {
                        $clickCount = $('<p class="click-count"></p>');
                        $(selector).after($clickCount);
                    }

                    $clickCount.text('Clicks: ' + clicks); // Met à jour le texte
                });
            },
            error: function(xhr, status, error) {
                console.error('Failed to fetch clicks:', xhr.responseText);
                console.error('Status:', status);
                console.error('Error:', error);
            }
        });
    }

    // Appel de la fonction pour initialiser les clics au chargement de la page
    updateClicks();

    // Gestion des clics sur les images
    $('.clickable-image').on('click', function() {
        var imageName = $(this).data('name'); // Récupération du nom de l'image

        $.ajax({
            url: 'https://127.0.0.1:8000/api/image/click',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ imageName: imageName }),
            success: function(response) {
                console.log('Clicks for ' + imageName + ': ' + response.clicks);
                updateClicks(); // Met à jour les clics après chaque enregistrement
            },
            error: function(xhr, status, error) {
                console.error('Failed to register click:', xhr.responseText);
                console.error('Status:', status);
                console.error('Error:', error);
            }
        });
    });
});
