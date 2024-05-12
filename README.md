# Graph Editor Template

This repository is a starter template for web-based graph editor applications.

Use the `Use this template` button to create a repository using this one as a starting point.

## Progress Tracker

-   [x] Create basic graph nodes and edges
-   [x] Add mock event listeners using offscreen canvas (are there fractional colors?)
-   [x] Create mouse zoom system (offset, dpr initial scale, center origin)
-   [x] Add graph editing keyboard shortcuts
    -   [x] Move point
    -   [x] Remove point
    -   [x] Add point
    -   [x] Add edge
    -   [x] Remove edge
    -   [x] Deselect
    -   [x] Undo (make each thing an action, and then make classes with an undo method, and a stack (w/ generics) for history)
    -   [ ] Improve icons
-   [x] Add any tests that may be useful
-   [x] Create global configuration system
-   [x] Create tooltip/info card that shows shortcuts on hover (synchronized with code)
-   [x] Add config/content pane on the left side (like streamlit)
-   [x] Benchmark/profile the system on large datasets
-   [x] Automatically center and scale based on dataset x and y coords
-   [x] Add zoom buttons
-   [ ] Split up css files
-   [ ] Find performance improvements (try doing stroke and fill only once for nodes and edges)
-   [ ] Create cleaning command to remove testing files for new repos
-   [ ] Add additional offscreen canvas for edges only to increase scalability
-   [ ] Add wraparound handling for items outside the range
-   [ ] Make sure the color system works beyond 256^3
-   [ ] Change action names to be based on actions and not names of things (info-button-active => show-shortcut-info)
-   [ ] Improve class reusability, like with buttons
-   [ ] Add accessibility features

## Benchmark Results

The system has been tested on an M2 MacBook Air, using the FPS counter in the rendering
tab of Chrome DevTools.

#### Fully Connected (every node to every other node)

10 Nodes: 60 fps static, 60 fps moving
50 Nodes: 60 fps static, 60 fps moving
100 Nodes: 60 fps static, at min 20 fps moving

### Sparsely Connected (one edge per node)

10 Nodes: 60 fps static, 60 fps moving
50 Nodes: 60 fps static, 60 fps moving
100 Nodes: 60 fps static, 60 fps moving
500 Nodes: 60 fps static, 60 fps moving
1000 Nodes: 60 fps static, 60 fps moving
5000 Nodes: 60 fps static, 50 fps moving
10000 Nodes: 45 fps static, 35 fps moving
50000 Nodes: 15 fps static, 12 fps moving

