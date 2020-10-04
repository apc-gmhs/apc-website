const entryViewer = document.getElementsByClassName('entry-viewer')[0];
const entries = document.getElementsByClassName('entry');
const prevButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');

// 60vw + 35 for margin between entries
const ENTRY_SCROLL_FACTOR = (document.documentElement.clientWidth * 0.6) + 35;

entries[0].classList.add('visible');

let mostRecentEntry = entries[0];

for (let entry of entries) {
    if (getEntryDate(entry) > getEntryDate(mostRecentEntry)) {
        mostRecentEntry = entry;
    }
}

mostRecentEntry.scrollIntoView({ behavior: 'smooth' });

function getEntryDate(entryElement) {
    return Date.parse(entryElement.id.replace('entry-', ''));
}

nextButton.addEventListener('click', function() {
    entryViewer.scrollBy({ left: ENTRY_SCROLL_FACTOR, behavior: 'smooth' })
});

prevButton.addEventListener('click', function() {
    entryViewer.scrollBy({ left: -ENTRY_SCROLL_FACTOR, behavior: 'smooth' })
});


let observerOptions = {
    root: entryViewer,
    rootMargin: '0px',
    threshold: [0, 0.15, 0.9]
}

let observer = new IntersectionObserver(function(observerEntries, _) {
    for (let entry of observerEntries) {
        console.log(entry.intersectionRatio);
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

observer.observe(entries[0]);
observer.observe(entries[entries.length - 1]);
