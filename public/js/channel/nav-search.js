document.addEventListener('DOMContentLoaded', () => {
    const searchIcon = document.getElementById('searchIcon');
    const searchInput = document.getElementById('searchInput');
    const searchForm = searchInput.closest('form'); // form 태그 가져오기

    searchIcon.addEventListener('click', () => { // 검색 아이콘을 클릭 시 
        searchInput.classList.toggle('active'); // 검색창을 보이거나, 안보이게 하기위해서
        if (searchInput.classList.contains('active')) {
            searchInput.focus(); // 자동으로 검색창에 커서를 이동시킴
        } else {
            searchInput.value = '';
        }
    });

    searchForm.addEventListener('submit', (e) => { // 제출 시
        const query = searchInput.value.trim();
        if (query === '') {
            e.preventDefault(); // form 제출 막기
            alert('검색어를 입력하세요.');
            window.location.href = `/channel/${channelId}/Home`;
        }
    });
});