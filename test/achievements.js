// 업적 목록 정의
const achievements = [
    {
        id: 'click_100',
        name: '100번 클릭!',
        description: '버튼을 100번 클릭했습니다.',
        image: 'images/achv_click_100.png',
        achieved: false
    },
    {
        id: 'minus_100',
        name: '-100점 달성!',
        description: '점수가 -100점이 되었습니다.',
        image: 'images/achv_minus_100.png',
        achieved: false
    }
];

// 업적 달성 체크 함수
export function checkAchievement(id) {
    const ach = achievements.find(a => a.id === id);
    if (ach && !ach.achieved) {
        ach.achieved = true;
        showAchievementNotification(ach);
    }
}

// 업적 달성 알림 표시
function showAchievementNotification(achievement) {
    const notif = document.createElement('div');
    notif.style.position = 'fixed';
    notif.style.top = '30px';
    notif.style.right = '30px';
    notif.style.background = '#fff';
    notif.style.border = '2px solid #4caf50';
    notif.style.padding = '18px 24px';
    notif.style.zIndex = 10000;
    notif.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
    notif.style.display = 'flex';
    notif.style.alignItems = 'center';
    notif.style.borderRadius = '12px';

    const img = document.createElement('img');
    img.src = achievement.image;
    img.alt = achievement.name;
    img.style.width = '56px';
    img.style.height = '56px';
    img.style.marginRight = '18px';

    const text = document.createElement('div');
    text.innerHTML = `<strong style="font-size:1.1em">${achievement.name}</strong><br><span style="font-size:0.95em">${achievement.description}</span>`;

    notif.appendChild(img);
    notif.appendChild(text);

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3500);
}

// 업적 목록 반환
export function getAchievements() {
    return achievements;
}

export function renderAchievements(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    achievements.forEach(ach => {
        const item = document.createElement('div');
        item.style.display = 'inline-block';
        item.style.width = '180px';
        item.style.margin = '12px';
        item.style.textAlign = 'center';
        item.style.verticalAlign = 'top';

        const img = document.createElement('img');
        img.src = ach.achieved ? ach.image : 'images/locked.png';
        img.alt = ach.name;
        img.style.width = '96px';
        img.style.height = '96px';
        img.style.opacity = ach.achieved ? '1' : '0.3';

        const name = document.createElement('div');
        name.textContent = ach.achieved ? ach.name : '???';
        name.style.fontWeight = 'bold';
        name.style.marginTop = '8px';

        const desc = document.createElement('div');
        desc.textContent = ach.achieved ? ach.description : '';
        desc.style.fontSize = '0.95em';
        desc.style.marginTop = '4px';

        item.appendChild(img);
        item.appendChild(name);
        item.appendChild(desc);

        container.appendChild(item);
    });
}

