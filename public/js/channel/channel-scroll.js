function updateScrollButtons(wrapper) { 
    const scrollList = wrapper.querySelector('.scrollable-list'); // 스크롤 영역
    const leftBtn = wrapper.querySelector('.scroll-left'); // 왼쪽 버튼
    const rightBtn = wrapper.querySelector('.scroll-right'); // 오른쪽 버튼

    const scrollLeft = scrollList.scrollLeft; // 왼쪽으로 스크롤된 정도를 저장. 왼쪽일수록 작음
    const maxScrollLeft = Math.max(0, scrollList.scrollWidth - scrollList.clientWidth); // 스크롤 가능 가로길이를 저장. 음수 방지를 위해서 max 사용

    // 스크롤 가능 가로길이가 적어서 실질적으로 스크롤이 필요없는 상황일때, 버튼을 숨김
    if (maxScrollLeft <= 1) { 
        leftBtn.style.display = 'none';
        rightBtn.style.display = 'none';
        return;
    }

    // 왼쪽으로 완전히 치우쳤을때, 왼쪽 버튼을 숨김김
    if (scrollLeft <= 0) {
        leftBtn.style.display = 'none';
    } else {
        leftBtn.style.display = 'flex';
    }

    // 거의 오른쪽에 있을때, 오른 쪽 버튼을 숨김
    if (scrollLeft >= maxScrollLeft - 1) {
        rightBtn.style.display = 'none';
    } else {
        rightBtn.style.display = 'flex';
    }
}

document.querySelectorAll('.scroll-wrapper').forEach(wrapper => {
    const scrollList = wrapper.querySelector('.scrollable-list');
    const leftBtn = wrapper.querySelector('.scroll-left');
    const rightBtn = wrapper.querySelector('.scroll-right');

    leftBtn.addEventListener('click', () => {
        scrollList.scrollBy({ left: -400, behavior: 'smooth' });
    });

    rightBtn.addEventListener('click', () => {
        scrollList.scrollBy({ left: 400, behavior: 'smooth' });
    });

    scrollList.addEventListener('scroll', () => updateScrollButtons(wrapper));
    window.addEventListener('resize', () => updateScrollButtons(wrapper));

    updateScrollButtons(wrapper);
});
