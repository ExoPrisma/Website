/** MAIN METHODS **/
$(function() {
    // Scroll to the top
    $(window).on('beforeunload', function() {
        $(window).scrollTop(0);
    });

    animateHeader();

    animateIntro();
});

/** HELPER FUNCTIONS **/

/* || HEADER */

//HEADER ANIMATION
/**
 * Animate header, that is the button.
 */
function animateHeader() {
    addColorThemeSwitch();
    animateMenuButton();
}

/**
 * Add color theme switch button to toggle between 2 color themes
 */
function addColorThemeSwitch() {
    const $switch = $(".logo");

    $switch.each(function() {
        const $button = $(this);
        $button.on("click", function() {
            $button.css("display", "none");
            const $sibling = $button.siblings();
            const theme = $sibling.attr("class").split(" ")[1];
            $sibling.css("display", "block");
            $("body").attr("class", `${theme} font`);

            const $porfolioImage = $(".carousel-item img");
            $porfolioImage.each(function() {
                const $img = $(this);
                $img.hasClass(`${theme}`) ? $img.show() : $img.hide();
            })
        });
    });
}

/**
 * Animate menu button to tranform from 3 bars to X.
 */
function animateMenuButton() {
    const $menuBtn = $(".menu-btn");
    const $menuContent = $(".dropdown-content");
    let isShown = false;

    function toggleMenu() {
        isShown = !isShown;
        $menuBtn.toggleClass("close", isShown);
        if (isShown) {
            $menuContent.slideDown(); 
        } else {
            $menuContent.slideUp(); 
        }
      }

    $menuBtn
        .on("click", toggleMenu)
        .hover(
            function() {
                if (!isShown) {
                    $menuBtn.addClass("close")
                    $menuContent.slideDown(); 
                }
            }, 
            function() {
                if (!isShown) {
                    $menuBtn.removeClass("close");
                    $menuContent.slideUp(); 
                }
            }
        );
}

/* || INTRO */

// INTRO ANIMATION 
/**
 * Animate the intro which comprise the text and the ampersand. 
 */
function animateIntro() {
    let delay = 0.5;

    const $text = $(`.fade-in`);
    $text.each(function() {
        delay = bottomUpWordAnimation($(this), delay);
    });

    const $summary = $(`.intro-summary`);
    $summary.each(function() {
        delay = bottomUpLineAnimation($(this), delay);
    })
}

/**
 * Animates a word.
 * 
 * @param {*} $textDiv element to be animated 
 * @param {*} delay the delay the current element
 * @returns {num} number of seconds delayed for next element
 */
function bottomUpWordAnimation($textDiv, delay) {
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

            $textDiv.append($span);

            delay += 0.3;
        }
    })

    return delay;
}

/**
 * Find lines of a text from a div containing text depending on size of div.
 * 
 * @param {jQuery} $container containing text
 * @returns lines containing text
 */
function getLines($container) {
    // Create invisible clone
    const $clone = $container.clone()
        .css({
            "visibility" : "hidden",
            "white-space" : "nowrap"
        })
        .appendTo($(".intro-container"));
    const $text = $clone.find(".text").empty();

    const text = $container.text();
    const words = text.split(" ");
    const lines = [];
    let tempLine = "";
    
    words.forEach(function(word) {
        if(!/^\s*$/.test(word)){
            const testLine = tempLine + word + " ";
            $text.text(`${testLine}`);
        
            if ($text.prop("scrollWidth") > $clone.prop("clientWidth")) {
                lines.push(tempLine);
                tempLine = word + " ";
            } else {
                tempLine = testLine;
            }
        }
    });

    $clone.remove();
    
    lines.push(tempLine);
    return lines;
}

/**
 * Animate a line. 
 * 
 * @param {jQuery} $textDiv element to be animated 
 * @param {num} delay the delay the current element
 * @returns number of seconds delayed for next element
 */
function bottomUpLineAnimation($textDiv, delay) {
    const $summary = $textDiv.find(".text");
    const lines = getLines($textDiv);
    $summary.empty();

    lines.forEach(function(line) {
        const $span = $('<span>', {
            class: 'word',
            text: `${line}` 
        });

        $span.css('animation-delay', `${delay}s`);

        $summary.append($span);

        delay += 0.25;
    });

    return delay;
}

