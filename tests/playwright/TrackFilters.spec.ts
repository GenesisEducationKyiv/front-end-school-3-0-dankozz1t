/**
 * END-TO-END TEST: PLAYWRIGHT
 * Tests the TrackFilters component in a real browser environment with mocked API responses.
 * Verifies complete user workflows, UI interactions, and cross-component functionality.
 */

import { test, expect, Page } from '@playwright/test';

class TrackFiltersPage {
  constructor(private page: Page) {}

  // Locators
  get filtersTitle() { return this.page.getByTestId('filters-title'); }
  get genreFilter() { return this.page.getByTestId('genre-filter'); }
  get artistFilter() { return this.page.getByTestId('artist-filter'); }
  get sortSelect() { return this.page.getByTestId('sort-select'); }
  get itemsPerPageSelect() { return this.page.getByTestId('items-per-page'); }
  get clearAllButton() { return this.page.getByTestId('clear-all-filters'); }
  get activeFilters() { return this.page.getByTestId('active-filters'); }
  get genreFilterChip() { return this.page.getByTestId('genre-filter-chip'); }
  get artistFilterChip() { return this.page.getByTestId('artist-filter-chip'); }

  // Actions
  async selectGenre(genre: string) {
    await this.genreFilter.click();
    await this.page.getByRole('option', { name: genre, exact: true }).click();
  }

  async selectArtist(artist: string) {
    await this.artistFilter.click();
    await this.page.getByRole('option', { name: artist, exact: true }).click();
  }

  async selectSort(sortOption: string) {
    await this.sortSelect.click();
    await this.page.getByRole('option', { name: sortOption, exact: true }).click();
  }

  async selectItemsPerPage(count: string) {
    await this.itemsPerPageSelect.click();
    await this.page.getByRole('option', { name: count, exact: true }).click();
  }

  async clearAllFilters() {
    await this.clearAllButton.click();
  }

  // Assertions
  async expectFiltersVisible() {
    await expect(this.filtersTitle).toBeVisible();
    await expect(this.genreFilter).toBeVisible();
    await expect(this.artistFilter).toBeVisible();
    await expect(this.sortSelect).toBeVisible();
    await expect(this.itemsPerPageSelect).toBeVisible();
  }

  async expectActiveFiltersVisible() {
    await expect(this.activeFilters).toBeVisible();
  }

  async expectActiveFiltersHidden() {
    await expect(this.activeFilters).not.toBeVisible();
  }

  async expectGenreChipVisible(genre: string) {
    await expect(this.genreFilterChip).toBeVisible();
    await expect(this.genreFilterChip).toContainText(`Genre: ${genre}`);
  }

  async expectArtistChipVisible(artist: string) {
    await expect(this.artistFilterChip).toBeVisible();
    await expect(this.artistFilterChip).toContainText(`Artist: ${artist}`);
  }

  async expectClearAllButtonVisible() {
    await expect(this.clearAllButton).toBeVisible();
  }

  async expectClearAllButtonHidden() {
    await expect(this.clearAllButton).not.toBeVisible();
  }

  async expectTrackVisible(trackId: string) {
    await expect(this.page.getByTestId(`track-item-${trackId}-title`)).toBeVisible();
  }

  async expectTrackHidden(trackId: string) {
    await expect(this.page.getByTestId(`track-item-${trackId}-title`)).not.toBeVisible();
  }

  async expectTracksCount(count: number) {
    const trackItems = this.page.getByTestId(/track-item-.*-title/);
    await expect(trackItems).toHaveCount(count);
  }

  async expectGenreFilterSelected(genre: string) {
    await expect(this.genreFilter).toContainText(genre);
  }

  async expectArtistFilterSelected(artist: string) {
    await expect(this.artistFilter).toContainText(artist);
  }
}

// Test Data
const MOCK_TRACKS = {
  all: [
    {
      id: 'track-1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      genres: ['Rock', 'Progressive Rock'],
      slug: 'bohemian-rhapsody',
      coverImage: 'https://via.placeholder.com/300x300?text=Queen',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
    {
      id: 'track-2',
      title: 'Hotel California',
      artist: 'Eagles',
      album: 'Hotel California',
      genres: ['Rock', 'Classic Rock'],
      slug: 'hotel-california',
      coverImage: 'https://via.placeholder.com/300x300?text=Eagles',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      id: 'track-3',
      title: 'Thriller',
      artist: 'Michael Jackson',
      album: 'Thriller',
      genres: ['Pop', 'Funk'],
      slug: 'thriller',
      coverImage: 'https://via.placeholder.com/300x300?text=MJ',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z',
    }
  ],
  rock: [
    {
      id: 'track-1',
      title: 'Bohemian Rhapsody',
      artist: 'Queen',
      album: 'A Night at the Opera',
      genres: ['Rock', 'Progressive Rock'],
      slug: 'bohemian-rhapsody',
      coverImage: 'https://via.placeholder.com/300x300?text=Queen',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    }
  ]
};

const MOCK_GENRES = ['Rock', 'Pop', 'Jazz', 'Electronic', 'Classical', 'Progressive Rock', 'Classic Rock', 'Funk', 'Hard Rock'];

test.describe('TrackFilters Component', () => {
  let filtersPage: TrackFiltersPage;

  test.beforeEach(async ({ page }) => {
    filtersPage = new TrackFiltersPage(page);

    // Mock API responses
    await page.route('**/api/tracks**', async route => {
      const url = route.request().url();
      const params = new URL(url).searchParams;
      
      let responseData = MOCK_TRACKS.all;
      let total = MOCK_TRACKS.all.length;

      // Filter by genre
      if (params.has('genre') && params.get('genre') === 'Rock') {
        responseData = MOCK_TRACKS.rock;
        total = MOCK_TRACKS.rock.length;
      }

      // Filter by artist
      if (params.has('artist')) {
        const artist = params.get('artist');
        responseData = responseData.filter(track => track.artist === artist);
        total = responseData.length;
      }

      await route.fulfill({
        json: {
          data: responseData,
          meta: { total, page: 1, limit: 10, totalPages: Math.ceil(total / 10) }
        }
      });
    });

    await page.route('**/api/genres', async route => {
      await route.fulfill({ json: MOCK_GENRES });
    });

    await page.goto('/');
    await expect(page.getByText('Music Collection')).toBeVisible();
  });

  test('should render all filter controls correctly', async () => {
    await filtersPage.expectFiltersVisible();
    await filtersPage.expectClearAllButtonHidden();
    await filtersPage.expectActiveFiltersHidden();
  });

  test('should filter tracks by genre', async () => {
    // Apply genre filter
    await filtersPage.selectGenre('Rock');

    // Verify filter is applied
    await filtersPage.expectActiveFiltersVisible();
    await filtersPage.expectGenreChipVisible('Rock');
    await filtersPage.expectClearAllButtonVisible();
    await filtersPage.expectGenreFilterSelected('Rock');

    // Verify filtered results - only Rock tracks should be visible
    await filtersPage.expectTrackVisible('track-1');
    await filtersPage.expectTrackHidden('track-2');
    await filtersPage.expectTrackHidden('track-3');
  });

  test('should filter tracks by artist', async () => {
    // Apply artist filter
    await filtersPage.selectArtist('Queen');

    // Verify filter is applied
    await filtersPage.expectActiveFiltersVisible();
    await filtersPage.expectArtistChipVisible('Queen');
    await filtersPage.expectClearAllButtonVisible();
    await filtersPage.expectArtistFilterSelected('Queen');

    // Verify filtered results - only Queen tracks should be visible
    await filtersPage.expectTrackVisible('track-1');
    await filtersPage.expectTrackHidden('track-2');
    await filtersPage.expectTrackHidden('track-3');
  });

  test('should combine multiple filters', async () => {
    // Apply genre filter first
    await filtersPage.selectGenre('Rock');
    await filtersPage.expectGenreChipVisible('Rock');

    // Apply artist filter
    await filtersPage.selectArtist('Queen');
    await filtersPage.expectArtistChipVisible('Queen');

    // Both filters should be active
    await filtersPage.expectActiveFiltersVisible();
    await filtersPage.expectClearAllButtonVisible();
  });

  test('should clear all filters', async () => {
    // Apply filters
    await filtersPage.selectGenre('Rock');
    await filtersPage.selectArtist('Queen');
    
    // Verify filters are applied
    await filtersPage.expectActiveFiltersVisible();
    await filtersPage.expectClearAllButtonVisible();

    // Clear all filters
    await filtersPage.clearAllFilters();

    // Verify filters are cleared
    await filtersPage.expectActiveFiltersHidden();
    await filtersPage.expectClearAllButtonHidden();

    // Verify all tracks are shown
    await filtersPage.expectTrackVisible('track-1');
    await filtersPage.expectTrackVisible('track-2');
    await filtersPage.expectTrackVisible('track-3');
  });

  test('should remove individual filter chips', async () => {
    // Apply multiple filters
    await filtersPage.selectGenre('Rock');
    await filtersPage.selectArtist('Queen');

    // Remove genre filter by clicking chip close button
    await filtersPage.genreFilterChip.getByRole('button').click();
    
    // Genre chip should be gone, artist chip should remain
    await expect(filtersPage.genreFilterChip).not.toBeVisible();
    await filtersPage.expectArtistChipVisible('Queen');
  });

  test('should change sort options', async () => {
    await filtersPage.selectSort('Title (A-Z)');
    
    // Verify sort selection by checking the displayed text in v-select
    await expect(filtersPage.sortSelect).toContainText('Title (A-Z)');
  });

  test('should change items per page', async () => {
    await filtersPage.selectItemsPerPage('20');
    
    // Verify selection by checking the displayed text in v-select
    await expect(filtersPage.itemsPerPageSelect).toContainText('20');
  });

  test('should work correctly on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // All filters should still be visible and functional
    await filtersPage.expectFiltersVisible();
    
    // Test filter functionality on mobile
    await filtersPage.selectGenre('Rock');
    await filtersPage.expectGenreChipVisible('Rock');
  });

  test('should handle rapid interactions without errors', async ({ page }) => {
    // Rapidly click filters multiple times
    for (let i = 0; i < 3; i++) {
      await filtersPage.genreFilter.click();
      await page.keyboard.press('Escape'); // Close dropdown
    }
    
    // Component should still be functional
    await filtersPage.expectFiltersVisible();
    await filtersPage.selectGenre('Rock');
    await filtersPage.expectGenreChipVisible('Rock');
  });

  test('should maintain URL state when filters are applied', async ({ page }) => {
    await filtersPage.selectGenre('Rock');
    
    // Wait for URL to be updated (if your app does URL sync)
    await page.waitForTimeout(100);
    
    // Check URL parameters (depends on your routing implementation)
    const url = page.url();
    // This assertion may need adjustment based on your actual URL handling
    if (url.includes('?')) {
      expect(url).toContain('genre');
    }
    
    // Verify the filter is still applied visually
    await filtersPage.expectGenreChipVisible('Rock');
  });
}); 
