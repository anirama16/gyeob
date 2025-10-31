const animationSection = document.querySelector('#main4');
const boxes = Array.from(document.querySelectorAll('.box'));
const circleContainer = document.querySelector('#circleContainer');
const bottomText = document.querySelector('.main4_bottom');
const numBoxes = boxes.length;

let rotationOffset = 0;
let autoRotate = false;
let scrollProgress = 0;

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

// 중앙 기준
function calcCenter() {
    const rect = circleContainer.getBoundingClientRect();
    return {
        x: rect.width / 2,
        y: rect.height / 2,
        radius: Math.min(rect.width, rect.height) * 0.25
    };
}

// 이미지 시작 위치
function getStartPositions(center) {
    return [
        {x: center.x - 400, y: center.y - 200},
        {x: center.x + 1000, y: center.y},
        {x: center.x - 400, y: center.y + 1300},
        {x: center.x + 300, y: center.y - 300},
        {x: center.x - 800, y: center.y - 100},
        {x: center.x + 300, y: center.y + 1300},
        {x: center.x, y: center.y - 300},
        {x: center.x, y: center.y + 1300},
        {x: center.x + 1000, y: center.y + 1300},
        {x: center.x, y: center.y - 300},
    ];
}

// 이미지 크기
const boxScales = [
    { start: 1, end: 0.4 }, { start: 0.5, end: 0.02 }, { start: 1, end: 0.3 },
    { start: 1, end: 0.5 }, { start: 1, end: 0.02 }, { start: 1, end: 0.2 },
    { start: 1, end: 0.3 }, { start: 1, end: 0.05 }, { start: 1, end: 0.5 },
    { start: 1, end: 0.3 }
];

const rotateStart = 0.65;  // 이미지 회전 시작 비율
const textStart = 0.7;     // 텍스트 등장 시작 비율

function onScroll() {
    const rect = animationSection.getBoundingClientRect();
    const sectionTop = rect.top;
    const sectionHeight = rect.height;
    const windowHeight = window.innerHeight;

    const rawProgress = (windowHeight - sectionTop) / (sectionHeight + windowHeight);
    scrollProgress = Math.max(0, Math.min(1, rawProgress));

    // 이미지 회전 시작
    autoRotate = scrollProgress >= rotateStart;

    // 텍스트 등장
    if (scrollProgress >= textStart) {
        bottomText.classList.add('visible');
    } else {
        bottomText.classList.remove('visible');
    }
}
window.addEventListener('scroll', onScroll, { passive: true });

// 렌더 루프
function renderLoop() {
    const center = calcCenter();
    const startPositions = getStartPositions(center);

    boxes.forEach((box, i) => {
        let x, y, scale;

        if (!autoRotate) {
            const eased = easeOut(scrollProgress);
            const start = startPositions[i % startPositions.length];
            const endX = center.x + Math.cos((i / numBoxes) * Math.PI * 2) * center.radius;
            const endY = center.y + Math.sin((i / numBoxes) * Math.PI * 2) * center.radius;

            x = start.x + (endX - start.x) * eased;
            y = start.y + (endY - start.y) * eased;

            scale = boxScales[i % boxScales.length].start +
                (boxScales[i % boxScales.length].end - boxScales[i % boxScales.length].start) * eased;

            box.dataset.scale = scale;
        } else {
            rotationOffset -= 0.05; // 🔹속도 적당히 조절
            const angle = (i / numBoxes) * Math.PI * 2 + (rotationOffset * Math.PI / 180); // 🔹라디안 단위로 변환 복원
            x = center.x + Math.cos(angle) * center.radius;
            y = center.y + Math.sin(angle) * center.radius;
            scale = +box.dataset.scale || boxScales[i % boxScales.length].end;
        }

        box.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${scale})`;
    });

    requestAnimationFrame(renderLoop);
}

// 초기화
window.addEventListener('load', () => {
    const center = calcCenter();
    const startPositions = getStartPositions(center);

    boxes.forEach((box, i) => {
        const s = startPositions[i % startPositions.length];
        const scale = boxScales[i % boxScales.length].start;
        box.dataset.scale = scale;
        box.style.transform = `translate3d(${s.x}px, ${s.y}px,0) translate(-50%, -50%) scale(${scale})`;
    });

    requestAnimationFrame(renderLoop);
});
