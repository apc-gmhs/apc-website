const entryViewer = document.getElementsByClassName('entry-viewer')[0];
const entries = document.getElementsByClassName('entry');
const prevButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');

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