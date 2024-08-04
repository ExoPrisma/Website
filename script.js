function bottomUpAnimation($textDiv, delay) {
    const divContent = $textDiv.text();
    $textDiv.empty();

    const words = divContent.split(" ");

    words.forEach(function(word) {
        if(!/^\s*$/.test(word)){

            const $span = $('<span>', {
                class: 'word',
                text: `${word}` 
            });

            $span.css('animation-delay', `${delay}s`);

                // Append span to the container
            $textDiv.append($span);
        }
    })
}

$(function() {
   const $text = $(`.fade-in`);
   let delay = 0;
   $text.each(function() {
        bottomUpAnimation($(this), delay);
        delay += 0.5;
   })
});