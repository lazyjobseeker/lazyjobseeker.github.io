const elems = document.querySelectorAll('.google-auto-placed');
const elems2 = document.querySelectorAll('.adsbygoogle adsbygoogle-noablate');

elems.forEach(elem => {

    elem.style.setProperty('clear', 'none');
    
    });


elems2.forEach(elem => {

    elem.style.setProperty('clear', 'none');
    
    });

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 && // ELEMENT_NODE
          (node.classList.contains('google-auto-placed') || node.classList.contains('adsbygoogle'))
        ) {
          // ✅ Your logic to run after ad is inserted
          console.log('Ad inserted:', node);
          node.style.clear = 'none'; // Example: remove AdSense float-clear style
        }
      });
    }
  }
});

// Start observing the whole document
observer.observe(document.body, {
  childList: true,
  subtree: true
});