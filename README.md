# Graph Editor Template

This repository is a starter template for web-based graph editor applications.

Use the `Use this template` button to create a repository using this one as a starting point.

## Progress Tracker

-   [x] Create basic graph nodes and edges
-   [x] Add mock event listeners using offscreen canvas (are there fractional colors?)
-   [x] Create mouse zoom system (offset, dpr initial scale, center origin)
-   [ ] Add graph editing keyboard shortcuts
    -   [ ] Move point
    -   [ ] Remove point
    -   [x] Add point
    -   [ ] Add edge
    -   [ ] Remove edge
    -   [ ] Deselect
    -   [x] Undo (make each thing an action, and then make classes with an undo method, and a stack (w/ generics) for history)
-   [ ] Create tooltip/info card that shows shortcuts on hover (synchronized with code)
-   [ ] Create global configuration system
-   [ ] Benchmark/profile the system on large datasets
-   [x] Add any tests that may be useful
-   [ ] Create cleaning command to remove testing files for new repos
-   [ ] Automatically center and scale based on dataset x and y coords
-   [ ] Add additional offscreen canvas for edges only to increase scalability
-   [ ] Add wraparound handling for items outside the range
-   [ ] Make sure the color system works beyond 256^3

