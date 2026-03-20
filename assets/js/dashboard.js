/**
 * ARKIGREEN - Dashboard Logic
 * Loads from embedded JSON to bypass CORS on local file://
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    let data;
    try {
        const jsonElement = document.getElementById('projects-json');
        if (jsonElement) {
            data = JSON.parse(jsonElement.textContent);
            console.log("Data loaded from embedded JSON");
        } else {
            throw new Error("No embedded JSON found");
        }
    } catch (error) {
        console.error("Dashboard init failed:", error);
        return;
    }

    const project = data.projects[0];
    populateSelector(data.projects);
    renderOverview(project);
    renderMaterials(project.materials);
    renderTimeline(project.timelineEvents);
    renderCharts(project.sustainabilityScores);
    renderDocuments(project.documents);
    renderMessages(project.messages);

    initSidebarToggle();
}

function populateSelector(projects) {
    const selector = document.getElementById('project-selector');
    if (!selector) return;
    projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.projectName;
        selector.appendChild(opt);
    });
}

function renderOverview(project) {
    const container = document.getElementById('overview-content');
    if (!container) return;
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 5px;">Project Status</p>
            <span class="status-badge ${project.status === 'In Progress' ? 'status-in-progress' : 'status-on-hold'}">${project.status}</span>
        </div>
        <div style="margin-bottom: 20px;">
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 5px;">Phase: <strong>${project.phase}</strong></p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.completionPercent}%"></div>
            </div>
            <p style="text-align: right; font-size: 0.8rem; margin-top: 5px;">${project.completionPercent}% Complete</p>
        </div>
        <div>
            <p class="text-muted" style="font-size: 0.8rem; margin-bottom: 5px;">Project Manager</p>
            <p><strong>${project.projectManager}</strong></p>
            <button class="btn btn-outline" style="width: 100%; margin-top: 15px; padding: 8px;">Contact PM</button>
        </div>
    `;
}

function renderMaterials(materials) {
    const container = document.getElementById('material-list');
    if (!container) return;
    container.innerHTML = materials.slice(0, 3).map(m => `
        <div class="material-card">
            <img src="${m.image}" class="material-swatch" alt="${m.name}">
            <p style="font-size: 0.8rem; font-weight: 600;">${m.name}</p>
            <p class="text-muted" style="font-size: 0.7rem;">${m.supplier}</p>
            <span style="font-size: 0.7rem; color: ${m.status === 'Approved' ? 'var(--color-green)' : 'var(--color-brass)'}">${m.status}</span>
        </div>
    `).join('');
}

function renderTimeline(events) {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl || typeof FullCalendar === 'undefined') return;
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: events,
        height: 350
    });
    calendar.render();
}

function renderCharts(scores) {
    const canvas = document.getElementById('leedChart');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['LEED Score', 'Remaining'],
            datasets: [{
                data: [scores.leedScore, 100 - scores.leedScore],
                backgroundColor: ['#3b6b52', '#2a3d33'],
                borderWidth: 0
            }]
        },
        options: { cutout: '80%', plugins: { legend: { display: false } } }
    });
}

function renderDocuments(docs) {
    const table = document.getElementById('document-table');
    if (!table) return;
    table.innerHTML = docs.map(d => `
        <tr style="border-bottom: 1px solid var(--color-border);">
            <td style="padding: 10px;">${d.name}</td>
            <td>${d.date}</td>
            <td><button class="text-green" style="background: none; border: none; cursor: pointer;">Download</button></td>
        </tr>
    `).join('');
}

function renderMessages(msgs) {
    const container = document.getElementById('chat-thread');
    if (!container) return;
    container.innerHTML = msgs.map(m => `
        <div class="msg ${m.side}">
            <p>${m.text}</p>
            <span style="font-size: 0.7rem; opacity: 0.6; margin-top: 5px; display: block;">${m.timestamp}</span>
        </div>
    `).join('');
}

function initSidebarToggle() {
    const btn = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');
    if (btn && sidebar) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('active');
            } else {
                sidebar.classList.toggle('collapsed');
            }
        });
    }
}
