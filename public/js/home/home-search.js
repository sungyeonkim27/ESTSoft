// home_search.js
// html보다 나중에 js가 실행되도록 DOMContentLoaded 감쌈
document.addEventListener("DOMContentLoaded", () => {
    // 검색창, 검색버튼, 영상리스트 불러오기
    const searchInput = document.querySelector(".search-form input[type='search']"); 
    const searchBtn = document.querySelector(".search-form button"); 
    const videoGrid = document.querySelector(".video-grid"); 
    const searchResult = document.querySelector(".search-result"); 
    const categoryBtns = document.querySelectorAll(".category-btn");  
    // 현재 페이지 url의 쿼리스트링 가져오기
    const urlParams = new URLSearchParams(window.location.search); 
    const searchQuery = urlParams.get("search"); 

    // 페이지 로드 시작하자마자 무조건 videoGrid 숨기기
    if (videoGrid) videoGrid.style.display = "none"; // 일단은 감추기 위함
    if (searchResult) searchResult.style.display = "none"; // 검색 결과를 페이지 로드 시에는 보이지 않게 하기 위해서

    //영상 가져오기 함수
    async function fetchVideos() {
        try {const res = await fetch("https://www.techfree-oreumi-api.ai.kr/video/getVideoList");  // 오르미 API 주소에서 정보 가져오기
            const data = await res.json(); // 가져온 정보 json 형식으로 저장
        
            // 영상 데이터 부르기
            const videosWithChannel = await Promise.all( // 다른 promise가 완료될때 까지 기다렸다가 실행
                data.map(async (video) => { // 위에서 가져온 데이터의 요소에 하나씩 함수 적용. 요소 이름은 video로 임의지정
                    try { // videolist에 채널 정보를 가져와 합치기 위함
                        const channelRes = await fetch(`https://www.techfree-oreumi-api.ai.kr/channel/getChannelInfo?id=${video.channel_id}`);
                        const channelInfo = await channelRes.json(); // API에서 채널 id 정보를 가져오고 json 형식으로 변경
                        return { ...video, channel: channelInfo }; // 
                    } catch (error) {
                        console.error('채널 정보 오류:', error); // 에러발생시
                        return {
                            ...video, //video는 그대로 출력
                            channel: { // 채널 정보는 에러 상황을 반영함
                                channel_name: 'Unknown',
                                channel_profile: '/assets/profiles/default-profile.svg'
                            }
                        };
                    }
                })
            );
        
            return videosWithChannel; // 채널정보까지 모두 불러오고 나면 합쳐진 정보를 변수에 저장
        } catch (error) {
            console.error("영상 목록 불러오기 실패:", error);
            return [];
        }
    }
        
    

    //영상 리스트 불러오기 함수 생성
    function renderVideos(videos) { 
        videoGrid.style.display = "none"; // 비디오 그리드를 보이지 않게 처리. 검색결과를 넣기 위해      
        searchResult.style.display = "block"; // 검색 결과를 보이도록 처리
        searchResult.innerHTML = "";  //검색 결과 내용 생성          
    
        videos.forEach(video => {
            const div = document.createElement("article"); // 새로운 요소 생성. 검색결과를 출력하기 위해서. 태그 이름 article
            div.className = "video-card"; // 새로우 요소에 이름 지정
            div.innerHTML = `
                <article class="search-item">
                    <a href="/video?id=${video.id}">
                        <figure class="video-thumbnail video-card no-invert">
                            <img class="thumbnail" src="${video.thumbnail}" alt="video thumbnail">
                            <video class="preview" muted loop preload="none">
                                <source src="https://storage.googleapis.com/youtube-clone-video/${video.id}.mp4" type="video/mp4">
                            </video>
                        </figure>
                    </a>

                    <figcaption class="video-info">
                        <div class="video-description">
                            <a href="/video?id=${video.id}">
                                <p class="video-title">${video.title}</p>
                            </a>
                            <a href="/video?id=${video.id}">
                                <span class="view">${formatViews(video.views)} Views • </span>
                                <span class="update-date">${getRelativeTime(video.created_dt)}</span>
                            </a>
                        </div>
                        
                        <a href="/channel/${video.channel.id}/Home" class="channel-meta">
                            <img class="channel-avatar no-invert" src="${video.channel.channel_profile}" alt="channel-profile">
                            <span class="channel-name">${video.channel.channel_name}</span>
                        </a>
                        
                    </figcaption>
                </article>
            `;



            searchResult.appendChild(div); // 검색결과를 html에 추가
        });
        enableThumbnailPreview(); // 썸네일 비디오 재생기능 
    }
    function formatViews(views) { // 시청횟수 출력 함수
        if (views >= 1_000_000) return (views / 1_000_000).toFixed(1) + "M"; //  백만 단위로 끈어서 M을 붙여서 출력함. 예) 3.4M
        if (views >= 1_000) return (views / 1_000).toFixed(1) + "K"; // 천 단위로 K를 붙여서 출력함. 예) 2.3k
        return views.toString(); // 천 미만이면 그냥 문자열로 출력
    }
    function getRelativeTime(dateString) { // 업로드 날짜 출력
        const uploadDate = new Date(dateString); // 입력된 날짜를 저장
        const now = new Date(); // 현재 시간을 저장
        const diffMs = now - uploadDate; // 입력된 날짜와 현재 시간의 차이를 저장
    
        const seconds = Math.floor(diffMs / 1000); // 밀리초를 초단위로 변환하여 저장. 소수점은 버림
        const minutes = Math.floor(seconds / 60); // 분단위로 변환
        const hours   = Math.floor(minutes / 60); // 시간 단위로 변환
        const days    = Math.floor(hours / 24); // 일 단위로 변환
        const weeks   = Math.floor(days / 7); // 주 단위로 변환
        const months  = Math.floor(days / 30); // 월 단위로 변환
        const years   = Math.floor(days / 365); // 년단위로 변환
    
        if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`; // 연 단위가 있으면, ago를 붙임. 만약 2이상이면 s도 붙임
        if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`; 
        if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return `just now`; // 현재시간과 입력된 날짜가 같으면 출력
    }
    function enableThumbnailPreview() { // 썸네일 비디오 재생기능
        document.querySelectorAll('.video-thumbnail').forEach(thumb => { 
            const video = thumb.querySelector('.preview'); // 비디오 썸네일 중 프리뷰 부분
            if (!video) return; 

            thumb.addEventListener('mouseenter', () => { // 마우스를 올리면 비디오 재생
                video.play();
            });

            thumb.addEventListener('mouseleave', () => { // 마우스를 치우면 비디오 정지.
                video.pause();
                video.currentTime = 0; // 비디오 재생시간을 초기화
            });
        });
    }
    
    
    //검색 기능 함수 생성
    async function handleSearch(keyword) {
        try {const allVideos = await fetchVideos(); // API에서 정보가져오기

            // 검색어 없으면 홈 화면 복구
            if (!keyword || keyword.trim() === "") { 
                videoGrid.style.display = "grid"; // 원래의 상태로 되돌림
                searchResult.style.display = "none"; 
                return;
            }
    
            const lowerKeyword = keyword.toLowerCase();
            const filtered = allVideos.filter(video =>
                video.title.toLowerCase().includes(lowerKeyword) ||
                video.tags.join(",").toLowerCase().includes(lowerKeyword) ||
                video.channel.channel_name.toLowerCase().includes(lowerKeyword)
            );
    
            if (filtered.length === 0) {
                alert("검색 결과가 없습니다.");
            } else {
                renderVideos(filtered);
            }
        } catch (error) {
            console.error("검색 처리 중 오류:", error);
        }
        
    }
    
    //버튼 기능 실행
    searchBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const keyword = searchInput.value;
        if (keyword === "") {
            window.location.href = "/";
            return;
        }
        window.location.href = `/?search=${encodeURIComponent(keyword)}`;
    });
    //검색창에서 엔터키 눌렀을 때도 검색 실행됨.
    searchInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const keyword = searchInput.value.trim();
            if (keyword === "") {
                window.location.href = "/";
                return;
            }

            window.location.href = `/?search=${encodeURIComponent(keyword)}`;
        }
    });

    // 필터 바에 있는 버튼 누르면 검색.
    categoryBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const category = btn.textContent.trim(); 
            if (category === "전체") {
                // "전체" 누르면 홈 복귀
                videoGrid.style.display = "grid";
                searchResult.style.display = "none";
            } else {
                handleSearch(category);
            }
        });
    });
    
    // 페이지 로드 시 URL 쿼리(search) 자동 검색
    if (searchQuery) {
        searchInput.value = searchQuery;
        handleSearch(searchQuery);
    }  else {
        videoGrid.style.display = "grid";
        searchResult.style.display = "none";
    }

});  //DOMContentLoaded 마지막