# Session qT7S47rty5NC6T5QNVj2MQ

**Assignment**: 게임 보드와 테트로미노 렌더링 기반 구축
## 목표
Canvas 위에 10x20 테트리스 그리드를 그리고, 7종 테트로미노(I, O, T, S, Z, J, L)가 상단에서 생성되어 화면에 표시되는 것까지 구현합니다.

## 달성할 결과
- HTML 파일에 Canvas 엘리먼트를 배치하고, JS에서 2D 렌더링 컨텍스트를 초기화합니다.
- 게임 보드를 10(가로) x 20(세로) 셀의 2차원 배열로 관리합니다. 각 셀은 비어있거나 블록 색상 정보를 가집니다.
- 7종 테트로미노의 형태를 2차원 배열로 정의합니다. 각 테트로미노는 고유한 색상을 가집니다.
- requestAnimationFrame 기반의 게임 루프를 구성하여, 매 프레임마다 보드와 현재 활성 블록을 Canvas에 그립니다.
- 새 블록이 보드 상단 중앙에 생성(spawn)되는 로직을 구현합니다.

## 맥락 (Why)
이 단계는 이후 모든 게임 로직(이동, 충돌, 라인 클리어)의 기반이 되는 렌더링 파이프라인과 데이터 구조를 확립합니다. 게임 루프가 정상 동작하고, 블록이 화면에 보여야 다음 단계의 입력/물리 로직을 검증할 수 있습니다.

## 기술 제약
- 순수 Vanilla JavaScript(ES6+)만 사용. 외부 라이브러리/프레임워크 절대 금지.
- 모든 그래픽은 Canvas API로 렌더링. DOM 기반 렌더링 금지.
- 번들러 미사용. index.html, style.css, game.js 파일 구조 유지.

## 완료 기준
브라우저에서 index.html을 열면 Canvas에 테트리스 그리드가 보이고, 랜덤 테트로미노 하나가 상단에 표시되며, 게임 루프가 동작하는 것을 확인할 수 있어야 합니다.

## Summary

A Tetris rendering pipeline was built using vanilla JavaScript and the Canvas API, establishing a 10x20 grid board managed as a 2D array where each cell stores empty or color state. Key decisions included using requestAnimationFrame for the game loop, defining all 7 tetrominoes (I, O, T, S, Z, J, L) as 2D shape arrays with unique colors, and enforcing a zero-dependency, no-bundler file structure of index.html, style.css, and game.js. The outcome is a functional rendering foundation where opening index.html displays the tetris grid with a randomly spawned tetromino at the top center, ready for input and physics logic in the next phase.

## Grains

- Canvas 테트리스 보드 및 테트로미노 렌더링 파이프라인
