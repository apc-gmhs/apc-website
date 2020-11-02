const entryViewer = document.getElementsByClassName('entry-viewer')[0];
const entries = document.getElementsByClassName('entry');
const prevButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');

// 60vw + 35 for margin between entries
const ENTRY_SCROLL_FACTOR = (document.documentElement.clientWidth * 0.6) + 35;

entries[entries.length - 2].scrollIntoView();

nextButton.addEventListener('click', function() {
    entryViewer.scrollBy({ left: ENTRY_SCROLL_FACTOR})
});

prevButton.addEventListener('click', function() {
    entryViewer.scrollBy({ left: -ENTRY_SCROLL_FACTOR})
});


let observerOptions = {
    root: entryViewer,
    rootMargin: '0px',
    threshold: [0, 0.15, 1]
}

let observer = new IntersectionObserver(function(observerEntries, _) {
    for (let entry of observerEntries) {
        if (entry.target == entries[0]) {
            if (entry.intersectionRatio < 0.25) {
                prevButton.classList.remove('disabled');
            } else {
                prevButton.classList.add('disabled');
            }
        } else {
            if (entry.intersectionRatio < 0.25) {
                nextButton.classList.remove('disabled');
            } else {
                nextButton.classList.add('disabled');
            }
        }
    }
}, observerOptions);

//takes correct arrow buttons away from first and last entry
observer.observe(entries[0]);
// Subtract 2 to account for unusable last entry
observer.observe(entries[entries.length - 2]);
