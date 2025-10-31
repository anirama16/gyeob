const width = 1920;
const height = 1080;
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

const initialScale = 250;
const zoomedScale = 1500;
const initialRotationSpeed = 0.5;
const slowRotationSpeed = 0.3;
let isZoomed = false;
let currentSpeed = initialRotationSpeed;
let rotation = 0;

const projection = d3.geoOrthographic()
    .scale(initialScale)
    .center([0, 0])
    .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

d3.timer(() => {
    rotation += currentSpeed;
    projection.rotate([rotation, 0]);
    svg.selectAll("path").attr("d", path);
});
d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json").then(data => {
    const countries = topojson.feature(data, data.objects.countries);

    svg.append("path")
        .datum({type: "Sphere"})
        .attr("class", "ocean")
        .attr("d", path);

    svg.selectAll(".country")
        .data(countries.features)
        .enter().append("path")
        .attr("class", "country")
        .attr("d", path);

    svg.on("click", function() {
        const zoomingIn = !isZoomed;
        const targetScale = zoomingIn ? zoomedScale : initialScale;
        isZoomed = zoomingIn;

        if (!zoomingIn) {
            currentSpeed = initialRotationSpeed;
            d3.select("#main-content").classed("visible", false);
        } else {
            currentSpeed = slowRotationSpeed;
        }

        d3.select("svg")
            .transition()
            .duration(1500)
            .tween("scale", function() {
                const i = d3.interpolate(projection.scale(), targetScale);
                return function(t) {
                    projection.scale(i(t));
                    svg.selectAll("path").attr("d", path);
                };
            })
            .on("end", function() {
                if (isZoomed) {
                    const content = d3.select("#main-content");
                    content.classed("visible", true);
                    content.style("opacity", 1); // 빼지마
                    content.style("pointer-events", "auto");
                }
            });
    });
}).catch(err => console.error(err));
//지구본----------------------------------------//






//main2 애니메이션----------------------------------------//
document.addEventListener("DOMContentLoaded", () => {
    const bubbles = document.querySelectorAll(".main2_bubble li")

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show")
            observer.unobserve(entry.target)
        }
        });
    }, { threshold: 0.2 })

    bubbles.forEach(li => observer.observe(li))
})
//main2 애니메이션----------------------------------------//



const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) { // 섹션이 화면에 들어왔을 때
            video1.play();          // 첫번째 비디오 재생
        }
    });
}, { threshold: 0.5 }); // 화면에 50% 이상 보일 때

observer.observe(document.getElementById('main7'));

// 첫번째 비디오 끝나면 두번째 비디오 재생
video1.addEventListener('ended', () => {
    video2.play();
});




document.addEventListener("DOMContentLoaded", () => {
    const section = document.querySelector("#main16");
    const wrappers = section.querySelectorAll(".main16_badgewrapper1, .main16_badgewrapper2");

    const observer = new IntersectionObserver(
        (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
            section.classList.add("active");
            wrappers.forEach(w => w.style.animationPlayState = "running");
            } else {
            wrappers.forEach(w => w.style.animationPlayState = "paused");
            }
        });
        },
    { threshold: 0.3 } // 화면 30% 이상 노출되면 실행
  );

    observer.observe(section);

  // 초기에는 애니메이션 멈춘 상태
    wrappers.forEach(w => w.style.animationPlayState = "paused");
});



// ---------- 섹션 단위 재생/정지 통합 관찰자 ----------
(() => {
    const options = {
        threshold: 0.55,           // 화면 55% 이상 보일 때 활성화
        rootMargin: '0px 0px -10% 0px'
    };

  // 섹션에서 활성화할 애니메이션/인터랙션 요소는 data-animate 속성 사용 권장
  // ex) <div data-animate="true"> ... </div>
    const sections = document.querySelectorAll('section');

  // 전역 비디오 일괄 제어(한 번에 여러 영상 재생을 막기 위해)
    function pauseAllOutside(section) {
        document.querySelectorAll('video').forEach(v => {
        if (!section.contains(v)) {
            if (!v.paused) v.pause();
            // 필요하면 타임리셋: v.currentTime = 0;
        }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
        const sec = entry.target;
        const videos = Array.from(sec.querySelectorAll('video'));
        const animatables = Array.from(sec.querySelectorAll('[data-animate]'));

        if (entry.isIntersecting) {
            animatables.forEach(el => {
            el.classList.add('play');
            });

            if (videos.length) {
            pauseAllOutside(sec);

if (videos.length) {
    pauseAllOutside(sec);

    // 모든 비디오 초기화
    videos.forEach(v => {
        v.muted = true;
        v.playsInline = true;
        v.pause();
        v.currentTime = 0;
    });

    let currentIndex = 0;

    function playNextVideo() {
        if (currentIndex >= videos.length) return;
        const v = videos[currentIndex];
        v.play().catch(() => {});
        v.onended = () => {
            currentIndex++;
            playNextVideo();
        };
    }

    playNextVideo();
    }
    }

        // 3) d3 지구본(또는 루프 애니메이션) 제어
        // 만약 #main1이 보이면 회전속도 유지, 아니면 멈춤
        if (sec.id === 'main1') {
            if (typeof currentSpeed !== 'undefined' && typeof initialRotationSpeed !== 'undefined') {
                currentSpeed = initialRotationSpeed;
            }
            }

        } else {
            animatables.forEach(el => el.classList.remove('play'));

            videos.forEach(v => {
            if (!v.paused) v.pause();
            });

            if (sec.id === 'main1') {
            if (typeof currentSpeed !== 'undefined') {
                currentSpeed = 0; 
            }
            }
        }
        });
    }, options);

    sections.forEach(s => observer.observe(s));

    window.addEventListener('load', () => {
        sections.forEach(s => {
        const rect = s.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (rect.top < vh * 0.55 && rect.bottom > vh * 0.45) {
            // 섹션이 이미 뷰포트 안이면 강제 트리거(IntersectionObserver가 늦게 트리거되는 경우 방지)
            observer.unobserve(s);
            observer.observe(s);
        }
        });
    });


})();







const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", e => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
    });

    // 클릭 시 확대 + 색 변경
    document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursor.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    });

    document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.backgroundColor = "rgba(246, 58, 145, 0.6)";
    });

    // 링크, 버튼 호버 시 확대
    document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1.3)";
        cursor.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    });
    el.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
        cursor.style.backgroundColor = "rgba(246, 58, 145, 0.6)";
    });
});


