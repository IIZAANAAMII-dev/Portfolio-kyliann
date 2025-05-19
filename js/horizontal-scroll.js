gsap.registerPlugin(ScrollTrigger);

let sections = gsap.utils.toArray('.horizontal-container .page')
console.log(sections)
let allSections = gsap.utils.toArray('.main-wrapper section')
console.log(allSections)



gsap.to(sections, {
    xPercent: -100 * (sections.length -1),
    ease: "none",
    scrollTrigger: {
        trigger: ".horizontal-wrapper",
        pin: true,
        start: 'top',        
        markers: true,
        scrub: 1,
    end: () => "+=" + (document.querySelector(".horizontal-container").offsetWidth / 4),
    }
})