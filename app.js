/* ── COLOURS ────────────────────────────────────────────────
   A fixed list of colours the user can pick for each habit.
   Each value is a "hex colour code" — a standard way to
   write colours in CSS and JavaScript.
─────────────────────────────────────────────────────────── */
var COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
    '#84cc16'  // lime
];


/* ── DATA ───────────────────────────────────────────────────
   These variables hold all of our app's data while the page
   is open. Think of them as the app's "memory".

   habits      — a list of habit objects, e.g.:
                 { id: 1, name: "Drink water", color: "#3b82f6" }

   completions — a list of habit IDs that have been ticked
                 off TODAY, e.g.: [1, 3]

   selectedColor — the colour currently chosen in the form
─────────────────────────────────────────────────────────── */
var habits = [];
var completions = [];
var selectedColor = COLORS[0];


/* ── HELPER: getStreak ──────────────────────────────────────
    This is the streak for how many days the habit was completed
   NOTE: This will be implemented in the back end so 
   without a stored history it returns 0 

   id — the unique ID of the habit we're checking
─────────────────────────────────────────────────────────── */
function getStreak(id) {
    return 0;
}


/* ── HELPER: getWeekPct ─────────────────────────────────────
    This is the weekly percentage for the amount of times the task
    has been completed
   NOTE: This will be implemented in the back end so 
   without a stored history it returns 0 

   id — the unique ID of the habit we're checking
─────────────────────────────────────────────────────────── */
function getWeekPct(id) {
    return 0;
}


/* ── RENDER: renderToday ────────────────────────────────────
   Draws everything inside the "Today" card:
     • Today's date
     • "X of Y habits completed" text
     • The progress bar fill width
     • The clickable list of habit items
─────────────────────────────────────────────────────────── */
function renderToday() {
    var total = habits.length;
    var count = completions.length; // how many are ticked today

    // Calculate percentage, avoid dividing by zero if there are no habits
    var pct = total > 0 ? Math.round((count / total) * 100) : 0;

    // Write today's date into the heading (e.g. "Sunday, June 15")
    var dateText = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('today-date-label').textContent = dateText;

    // Write the "X of Y habits completed" line
    document.getElementById('today-count').textContent = count + ' of ' + total + ' habits completed';

    // Write the percentage number
    document.getElementById('today-pct').textContent = pct + '%';

    // Set the progress bar width (CSS transition animates it smoothly)
    document.getElementById('progress-fill').style.width = pct + '%';

    // Get the container where we'll put the habit items
    var list = document.getElementById('today-list');

    // If there are no habits yet, show a friendly message instead
    if (habits.length === 0) {
        list.innerHTML = '<p class="empty-state">No habits yet. Go to "My Habits" to add some!</p>';
        return; // Stop here — nothing else to draw
    }

    // Build the HTML for every habit and put it all in the list container
    var html = '';
    for (var i = 0; i < habits.length; i++) {
        var habit = habits[i];
        // Check if this habit's ID is in the completions list
        var isDone = completions.includes(habit.id);
        html += buildHabitItem(habit, isDone);
    }
    list.innerHTML = html;
}


/* ── RENDER: renderHabits ───────────────────────────────────
   Draws everything inside the "My Habits" card:
     • The colour picker circles
     • The list of saved habits with stats and a delete button
─────────────────────────────────────────────────────────── */
function renderHabits() {
    // Draw all the colour circles in the colour-picker row
    var colorHtml = '';
    for (var i = 0; i < COLORS.length; i++) {
        colorHtml += buildColorBtn(COLORS[i]);
    }
    document.getElementById('colors-row').innerHTML = colorHtml;

    // Get the container for the habit rows
    var list = document.getElementById('habits-list');

    // If no habits exist, show a friendly message
    if (habits.length === 0) {
        list.innerHTML = '<p class="empty-state">No habits yet. Add one above!</p>';
        return;
    }

    // Build the HTML for every habit row
    var html = '';
    for (var i = 0; i < habits.length; i++) {
        html += buildHabitRow(habits[i]);
    }
    list.innerHTML = html;
}


/* ── HTML BUILDER: buildHabitItem ───────────────────────────
   Returns an HTML string for a single habit in the Today list.

   habit  — the habit object { id, name, color }
   isDone — true if this habit has been completed today
─────────────────────────────────────────────────────────── */
function buildHabitItem(habit, isDone) {
    // If the habit is done, add the "done" CSS class for green styling
    var doneClass = isDone ? 'done' : '';

    // The tick SVG inside the check circle
    var tickSvg = '<svg viewBox="0 0 12 10"><polyline points="1 5 4 8 11 1"/></svg>';

    return (
        '<div class="habit-item ' + doneClass + '" onclick="toggleHabit(\'' + habit.id + '\')">' +
        '<div class="check-circle">' + tickSvg + '</div>' +
        '<div class="dot" style="background:' + habit.color + '"></div>' +
        '<span class="habit-name">' + habit.name + '</span>' +
        '</div>'
    );
}


/* ── HTML BUILDER: buildColorBtn ────────────────────────────
   Returns an HTML string for one colour circle in the picker.

   color — a hex colour string like "#ef4444"
─────────────────────────────────────────────────────────── */
function buildColorBtn(color) {
    // Add the "selected" class if this is the currently chosen colour
    var selectedClass = (color === selectedColor) ? 'selected' : '';

    return (
        '<div class="color-btn ' + selectedClass + '" ' +
        'style="background:' + color + '" ' +
        'onclick="selectColor(\'' + color + '\')">' +
        '</div>'
    );
}


/* ── HTML BUILDER: buildHabitRow ────────────────────────────
   Returns an HTML string for one habit row in My Habits list.
   Shows the colour dot, name, streak/week stats, and a
   delete button.

   habit — the habit object { id, name, color }
─────────────────────────────────────────────────────────── */
function buildHabitRow(habit) {
    // Trash can icon SVG for the delete button
    var trashIcon =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<polyline points="3 6 5 6 21 6"/>' +
        '<path d="M19 6l-1 14H6L5 6"/>' +
        '<path d="M10 11v6"/>' +
        '<path d="M14 11v6"/>' +
        '<path d="M9 6V4h6v2"/>' +
        '</svg>';

    return (
        '<div class="habit-row">' +
        '<div class="dot" style="background:' + habit.color + '"></div>' +
        '<div>' +
        '<div class="habit-row-name">' + habit.name + '</div>' +
        '<div class="habit-row-stats">↗ ' + getStreak(habit.id) + ' day streak &nbsp; ' + getWeekPct(habit.id) + '% this week</div>' +
        '</div>' +
        '<button class="btn-delete" onclick="deleteHabit(\'' + habit.id + '\')">' + trashIcon + '</button>' +
        '</div>'
    );
}


/* ── ACTION: switchTab ──────────────────────────────────────
   Called when the user clicks "Today" or "My Habits".
   Shows the correct view and hides the other one.

   tab — either the string 'today' or 'habits'
─────────────────────────────────────────────────────────── */
function switchTab(tab) {
    var showingToday = (tab === 'today');

    // Show/hide the two view cards
    if (showingToday) {
        document.getElementById('view-today').classList.remove('hidden');
        document.getElementById('view-habits').classList.add('hidden');
    } else {
        document.getElementById('view-today').classList.add('hidden');
        document.getElementById('view-habits').classList.remove('hidden');
    }

    // Highlight the active tab button
    if (showingToday) {
        document.getElementById('tab-today').classList.add('active');
        document.getElementById('tab-habits').classList.remove('active');
    } else {
        document.getElementById('tab-today').classList.remove('active');
        document.getElementById('tab-habits').classList.add('active');
    }

    // Redraw whichever view we just switched to
    if (showingToday) {
        renderToday();
    } else {
        renderHabits();
    }
}


/* ── ACTION: toggleHabit ────────────────────────────────────
   Called when the user clicks a habit item in the Today list.
   If the habit isn't done yet, mark it done.
   If it's already done, un-mark it (toggle).

   id — the unique ID of the habit that was clicked
─────────────────────────────────────────────────────────── */
function toggleHabit(id) {
    var index = completions.indexOf(id);

    if (index === -1) {
        // Habit is NOT done → add its ID to the completions list
        completions.push(id);
    } else {
        // Habit IS done → remove its ID from the completions list
        completions.splice(index, 1);
    }

    renderToday(); // Redraw the Today view
}


/* ── ACTION: selectColor ────────────────────────────────────
   Called when the user clicks a colour circle in the picker.
   Updates the selected colour and redraws the picker so the
   new selection gets its dark border.

   color — the hex colour string that was clicked
─────────────────────────────────────────────────────────── */
function selectColor(color) {
    selectedColor = color;

    // Redraw the colour row so the right circle shows as "selected"
    var colorHtml = '';
    for (var i = 0; i < COLORS.length; i++) {
        colorHtml += buildColorBtn(COLORS[i]);
    }
    document.getElementById('colors-row').innerHTML = colorHtml;
}


/* ── ACTION: addHabit ───────────────────────────────────────
   Called when the user clicks "Add Habit".
   Reads the name from the input box, creates a new habit
   object with a unique ID, and refreshes the list.

   NOTE: We use habits.length as a simple unique ID for now.
   The back end will generate proper IDs later.
─────────────────────────────────────────────────────────── */
function addHabit() {
    var input = document.getElementById('habit-input');
    var name = input.value.trim(); // .trim() removes accidental spaces

    // Don't add a habit with no name — just focus the input box instead
    if (!name) {
        input.focus();
        return;
    }

    // Create the new habit object
    var newHabit = {
        id: habits.length.toString(), //REMOVE THE toString LATER WHEN CREATING THE BACKEND
                                      //TEMPORARY SOLUTION FOR THE ID 
        name: name,
        color: selectedColor
    };

    habits.push(newHabit); // Add it to our list

    input.value = ''; // Clear the text box
    renderHabits();   // Refresh the My Habits view
}


/* ── ACTION: cancelAdd ──────────────────────────────────────
   Called when the user clicks "Cancel" in the add-habit form.
   Clears the input and resets the selected colour.
─────────────────────────────────────────────────────────── */
function cancelAdd() {
    document.getElementById('habit-input').value = '';
    selectedColor = COLORS[0]; // Reset to the first colour (red)
    renderHabits();
}


/* ── ACTION: deleteHabit ────────────────────────────────────
   Called when the user clicks the trash icon next to a habit.
   Removes it from the habits list.

   id — the unique ID of the habit to remove
─────────────────────────────────────────────────────────── */
function deleteHabit(id) {
    // Keep all habits EXCEPT the one with this id
    habits = habits.filter(function (habit) {
        return habit.id !== id;
    });

    renderHabits(); // Refresh the view
}


/* ── INITIALISE ─────────────────────────────────────────────
   This runs automatically when the page loads.
   It draws the Today view so the user sees something straight
   away instead of a blank page.
─────────────────────────────────────────────────────────── */
renderToday();