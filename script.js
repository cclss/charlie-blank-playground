// script.js — The Type Foundry (활자 주조소)

// ---------------------------------------------------------------------------
// Lorem Ipsum 원문 데이터
// ---------------------------------------------------------------------------
const LOREM_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis molestie dictum sagittis, purus erat fermentum ligula, vitae ornare odio metus a mi. Morbi viverra ultrices metus. Nam mattis sem at arcu. Proin auctor, lectus vel rhoncus tristique, augue eros bibendum sapien, nec facilisis nisi eros et nisl.",
  "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.",
  "Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum, eros ipsum rutrum orci, sagittis tempus lacus enim ac dui. Donec non enim in turpis pulvinar facilisis. Ut felis. Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat.",
  "Nam dui ligula, fringilla a, euismod sodales, sollicitudin vel, wisi. Morbi auctor lorem non justo. Nam lacus libero, pretium at, lobortis vitae, ornare et, elit. Donec aliquet, tortor sed accumsan bibendum, erat ligula aliquet magna, vitae ornare odio metus a mi. Morbi ac orci et nisl hendrerit mollis. Quisque volutpat ligula ut quam.",
  "Fusce fermentum. Nullam varius nulla eu ante. Phasellus dui libero, iaculis at, consequat vitae, pulvinar vel, mi. Nunc iaculis diam id quam. Pellentesque feugiat neque at velit. Morbi auctor lorem non justo. Proin nec augue. Quisque aliquam tempor ante. Donec vel ante.",
  "Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor, facilisis luctus, metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus. Nam nulla quam, gravida non, commodo a, sodales sit amet, nisi.",
  "Nullam eu ante vel est convallis dignissim. Fusce suscipit, wisi nec facilisis facilisis, est dui fermentum leo, quis tempor ligula erat quis odio. Nunc porta vulputate tellus. Nunc rutrum turpis sed pede. Sed bibendum. Aliquam posuere. Nunc aliquet, augue nec adipiscing interdum, lacus tellus malesuada massa, quis varius mi purus non odio.",
  "Pellentesque condimentum, magna ut suscipit hendrerit, ipsum augue ornare nulla, non luctus diam neque sit amet urna. Curabitur vulputate vestibulum lorem. Fusce sagittis, libero non molestie mollis, magna orci ultrices dolor, at vulputate neque nulla lacinia eros. Sed id ligula quis est convallis tempor. Integer rutrum ante eu lacus.",
  "Quisque sit amet orci quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit. Duis sed odio sit amet nibh vulputate cursus a sit amet mauris. Morbi accumsan ipsum velit.",
];

// ---------------------------------------------------------------------------
// Lorem Ipsum 생성 함수
// ---------------------------------------------------------------------------

/**
 * 지정한 문단 수만큼 Lorem Ipsum 텍스트 배열을 반환한다.
 * count 가 LOREM_PARAGRAPHS 길이를 초과하면 모듈로 연산으로 순환한다.
 *
 * @param {number} count - 생성할 문단 수
 * @returns {string[]} 길이가 count 인 문단 문자열 배열
 */
function generateLoremIpsum(count) {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(LOREM_PARAGRAPHS[i % LOREM_PARAGRAPHS.length]);
  }
  return result;
}

// ---------------------------------------------------------------------------
// DOM 요소 참조
// ---------------------------------------------------------------------------
const paragraphCount = document.getElementById('paragraph-count');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const outputArea = document.getElementById('output-area');

// ---------------------------------------------------------------------------
// 이벤트 리스너: 생성 버튼
// ---------------------------------------------------------------------------
generateBtn.addEventListener('click', () => {
  const count = parseInt(paragraphCount.value, 10);
  const paragraphs = generateLoremIpsum(count);

  outputArea.innerHTML = '';

  paragraphs.forEach((text) => {
    const p = document.createElement('p');
    p.textContent = text;
    outputArea.appendChild(p);
  });

  copyBtn.disabled = false;
});
