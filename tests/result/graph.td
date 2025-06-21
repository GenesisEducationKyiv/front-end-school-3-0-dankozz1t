graph TD
    %% Test Categories
    TestSuite["🧪 Music Manager Test Suite"]
    
    %% Main Test Categories
    ComponentTests["📱 Component Tests<br/>(Vue Test Utils + Vitest)"]
    UnitTests["🔧 Unit Tests<br/>(Vitest)"]
    IntegrationTests["🔗 Integration Tests<br/>(Vitest)"]
    E2ETests["🌐 E2E Tests<br/>(Playwright)"]
    TestUtils["🛠️ Test Infrastructure"]
    
    %% Component Tests
    GlobalAudioPlayer["GlobalAudioPlayer.spec.ts<br/>🎵 Audio Player Component"]
    TrackForm["TrackForm.spec.ts<br/>📝 Track Form Modal"]
    TrackList["TrackList.spec.ts<br/>📋 Track List Component"]
    TrackListItem["TrackListItem.spec.ts<br/>🎶 Track List Item"]
    TrackSearch["TrackSearch.spec.ts<br/>🔍 Track Search Component"]
    
    %% Unit Tests - API Layer
    TrackApiUnit["trackApi.spec.ts<br/>🌐 API Layer"]
    
    %% Unit Tests - Composables
    UseAudioPlayer["useAudioPlayer.spec.ts<br/>🎵 Audio Player Logic"]
    UseTrackSelection["useTrackSelection.spec.ts<br/>☑️ Track Selection Logic"]
    
    %% Unit Tests - Store
    TrackStoreUnit["trackStore.spec.ts<br/>📦 Pinia Store Units"]
    
    %% Unit Tests - Services & Utils
    TrackService["trackService.spec.ts<br/>⚙️ Track Service (Whitebox)"]
    FormatTime["formatTime.spec.ts<br/>⏰ Time Formatter (Blackbox)"]
    
    %% Integration Tests
    TrackStoreIntegration["trackStore.spec.ts<br/>🔄 Store Integration"]
    
    %% E2E Tests
    TrackFilters["TrackFilters.spec.ts<br/>🎛️ Track Filters E2E"]
    
    %% Test Infrastructure
    TestUtilsFile["testUtils.ts<br/>🏗️ Mock Factories & Stubs"]
    SetupFile["setup.ts<br/>⚙️ Test Configuration"]
    
    %% Connections
    TestSuite --> ComponentTests
    TestSuite --> UnitTests
    TestSuite --> IntegrationTests
    TestSuite --> E2ETests
    TestSuite --> TestUtils
    
    %% Component Test Connections
    ComponentTests --> GlobalAudioPlayer
    ComponentTests --> TrackForm
    ComponentTests --> TrackList
    ComponentTests --> TrackListItem
    ComponentTests --> TrackSearch
    
    %% Unit Test Connections
    UnitTests --> TrackApiUnit
    UnitTests --> UseAudioPlayer
    UnitTests --> UseTrackSelection
    UnitTests --> TrackStoreUnit
    UnitTests --> TrackService
    UnitTests --> FormatTime
    
    %% Integration Test Connections
    IntegrationTests --> TrackStoreIntegration
    
    %% E2E Test Connections
    E2ETests --> TrackFilters
    
    %% Test Infrastructure Connections
    TestUtils --> TestUtilsFile
    TestUtils --> SetupFile
    
    %% Dependencies (Mocked)
    MockedStores["🎭 Mocked Dependencies"]
    PlayerStore["usePlayerStore"]
    TrackStore["useTrackStore"]
    NotificationStore["useNotificationStore"]
    ModalsPool["useModalsPool"]
    GenresStore["useGenresStore"]
    
    MockedApis["🌐 Mocked APIs"]
    TrackApi["trackApi"]
    HttpClient["HTTP Client"]
    
    MockedComposables["🎯 Mocked Composables"]
    TrackQueries["useTrackQueries"]
    UrlFilters["useUrlFilters"]
    Debounce["useDebounce"]
    
    MockedVue["⚡ Mocked Vue/Browser"]
    VueRouter["Vue Router"]
    MediaElement["HTMLMediaElement"]
    MatchMedia["window.matchMedia"]
    
    %% Dependency Connections
    ComponentTests -.-> MockedStores
    ComponentTests -.-> MockedApis
    
    MockedStores --> PlayerStore
    MockedStores --> TrackStore
    MockedStores --> NotificationStore
    MockedStores --> ModalsPool
    MockedStores --> GenresStore
    
    MockedApis --> TrackApi
    MockedApis --> HttpClient
    
    UnitTests -.-> MockedComposables
    IntegrationTests -.-> MockedComposables
    
    MockedComposables --> TrackQueries
    MockedComposables --> UrlFilters
    MockedComposables --> Debounce
    
    TestUtils -.-> MockedVue
    MockedVue --> VueRouter
    MockedVue --> MediaElement
    MockedVue --> MatchMedia
    
    %% Test Infrastructure Dependencies
    GlobalAudioPlayer -.-> TestUtilsFile
    TrackForm -.-> TestUtilsFile
    TrackList -.-> TestUtilsFile
    TrackListItem -.-> TestUtilsFile
    TrackSearch -.-> TestUtilsFile
    TrackApiUnit -.-> TestUtilsFile
    UseAudioPlayer -.-> TestUtilsFile
    UseTrackSelection -.-> TestUtilsFile
    TrackStoreUnit -.-> TestUtilsFile
    TrackStoreIntegration -.-> TestUtilsFile
    
    %% Test Types Legend
    TestTypes["📊 Test Types"]
    ComponentTest["Component Tests:<br/>- UI interaction<br/>- Props & events<br/>- Store integration"]
    UnitTest["Unit Tests:<br/>- Isolated logic<br/>- API layer<br/>- Composables<br/>- Utils"]
    IntegrationTest["Integration Tests:<br/>- Multi-component<br/>- Store workflows<br/>- API integration"]
    E2ETest["E2E Tests:<br/>- Full user workflows<br/>- Browser automation<br/>- Real interactions"]
    
    TestTypes --> ComponentTest
    TestTypes --> UnitTest  
    TestTypes --> IntegrationTest
    TestTypes --> E2ETest
    
    %% Styling
    classDef componentClass fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef unitClass fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef integrationClass fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef e2eClass fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px,color:#000
    classDef mockClass fill:#fce4ec,stroke:#880e4f,stroke-width:1px,stroke-dasharray: 5 5,color:#000
    classDef utilClass fill:#fff8e1,stroke:#ff6f00,stroke-width:2px,color:#000
    
    class GlobalAudioPlayer,TrackForm,TrackList,TrackListItem,TrackSearch,ComponentTests componentClass
    class TrackApiUnit,UseAudioPlayer,UseTrackSelection,TrackStoreUnit,TrackService,FormatTime,UnitTests unitClass
    class TrackStoreIntegration,IntegrationTests integrationClass
    class TrackFilters,E2ETests e2eClass
    class MockedStores,MockedApis,MockedComposables,MockedVue,PlayerStore,TrackStore,NotificationStore,ModalsPool,GenresStore,TrackApi,HttpClient,TrackQueries,UrlFilters,Debounce,VueRouter,MediaElement,MatchMedia mockClass
    class TestUtilsFile,SetupFile,TestUtils utilClass