document.querySelectorAll('.nav-scroll-wrapper').forEach(wrapper => { // 탭 메뉴 영역의 외부 래퍼
    const scrollArea = wrapper.querySelector('.nav-links-scrollable'); // 스크롤 가능한 탭 영역
    const leftBtn = wrapper.querySelector('.scroll-tab-left'); // 왼쪽에 생성되는 버튼
    const rightBtn = wrapper.querySelector('.scroll-tab-right'); // 오른쪽에 생성되는 버튼

    // 버튼 표시 상태 업데이트 함수
    const updateScrollButtons = () => { 
        const scrollLeft = scrollArea.scrollLeft; // scrollArea안에 내용이 많아져서 스크롤이 가능해 질때, 스크롤이 가장 왼쪽에 있을 수록 값이 작아짐
        const maxScroll = scrollArea.scrollWidth - scrollArea.clientWidth; // 전체 콘텐츠의 가로길이 - 현재 눈으로 보는 영역의 너비 = 스크롤 가능한 너비

        leftBtn.style.display = scrollLeft > 0 ? 'flex' : 'none'; // 오른쪽으로 조금이라도 스크롤 되어있으면 보이게
        rightBtn.style.display = scrollLeft < maxScroll - 1 ? 'flex' : 'none'; // 오른쪽으로 갈수록 오른쪽 버튼은 안보임, 스크롤 가능 영역이 커질수록 안보임
    };

    leftBtn.addEventListener('click', () => {
        scrollArea.scrollBy({ left: -200, behavior: 'smooth' }); // 왼쪽 버튼을 눌렀을 때, 왼쪽으로 200px 부드럽게 움직임
    });

    rightBtn.addEventListener('click', () => {
        scrollArea.scrollBy({ left: 200, behavior: 'smooth' });
    });

    scrollArea.addEventListener('scroll', updateScrollButtons); // 스크롤을 하면 함수를 다시 작동시켜서 보이거나 숨김을 결정함
    window.addEventListener('resize', updateScrollButtons); // 창 크기가 바뀌면 함수를 다시 작동시킴

    updateScrollButtons(); // 최초 호출
});