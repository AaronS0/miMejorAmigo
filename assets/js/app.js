const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const themeToggle = document.getElementById('themeToggle');

if (hamburger && sidebar) {
	hamburger.addEventListener('click', () => {
		const isOpen = sidebar.classList.toggle('open');
		// update ARIA / hidden
		hamburger.setAttribute('aria-expanded', String(isOpen));
		sidebar.setAttribute('aria-hidden', String(!isOpen));
		// ensure hamburger class matches sidebar side for positioning if needed
		if (sidebar.classList.contains('right')) {
			hamburger.classList.remove('left');
			hamburger.classList.add('right');
		} else if (sidebar.classList.contains('left')) {
			hamburger.classList.remove('right');
			hamburger.classList.add('left');
		}
	});
	// close sidebar when clicking outside (optional, keeps behavior consistent)
	document.addEventListener('click', (e) => {
		if (!sidebar.contains(e.target) && !hamburger.contains(e.target) && sidebar.classList.contains('open')) {
			sidebar.classList.remove('open');
			hamburger.setAttribute('aria-expanded', 'false');
			sidebar.setAttribute('aria-hidden', 'true');
		}
	});
}

if (themeToggle) {
	themeToggle.addEventListener('click', () => {
		const dark = document.body.classList.toggle('dark-mode');
		themeToggle.setAttribute('aria-pressed', String(dark));
		// Avoid creating any overlay; styles.css controls visual changes via variables.
	});
}