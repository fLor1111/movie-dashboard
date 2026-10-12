
const API_BASE_URL = "https://api.themoviedb.org/3";

const TOKEN = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

export async function fetchTMDB(endpoint, params = {}) {
  if (!TOKEN) {
    throw new Error(
      "TMDB token is missing. Check your .env file."
    );
  }

  const url = new URL(`${API_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status}`
    );
  }

  return response.json();
}


export function normalizeTitle(item, type) {
  const releaseDate =
    type === "movie"
      ? item.release_date
      : item.first_air_date;

  return {
    id: item.id,
    Title: item.title || item.name || "Untitled",
    Year: releaseDate ? releaseDate.slice(0, 4) : "N/A",
    Overview: item.overview || "",
    Poster: item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : null,
    Backdrop: item.backdrop_path
      ? `https://image.tmdb.org/t/p/original${item.backdrop_path}`
      : null,
    Rating: item.vote_average ?? 0,
    VoteCount: item.vote_count ?? 0,
    MediaType: type,
  };
}


export async function discoverTitles(type, page = 1) {
  const endpoint =
    type === "movie" ? "/discover/movie" : "/discover/tv";

  const data = await fetchTMDB(endpoint, {
    page,
    sort_by:
      type === "movie"
        ? "primary_release_date.desc"
        : "first_air_date.desc",
    include_adult: false,
    "vote_count.gte": 20,
  });

  return {
    results: data.results.map((item) =>
      normalizeTitle(item, type)
    ),
    totalPages: data.total_pages,
  };
}

export async function searchTitles(query, type, page = 1) {
  const endpoint =
    type === "movie" ? "/search/movie" : "/search/tv";

  const data = await fetchTMDB(endpoint, {
    query,
    page,
    include_adult: false,
  });

  return {
    results: data.results.map((item) =>
      normalizeTitle(item, type)
    ),
    totalPages: data.total_pages,
  };
}

function getWeightedRating(title) {
  const rating = title.Rating ?? 0;
  const votes = title.VoteCount ?? 0;

  const averageRating = 6.5;
  const minimumVotes = 250;

  return (
    (votes / (votes + minimumVotes)) * rating +
    (minimumVotes / (votes + minimumVotes)) * averageRating
  );
}

export function sortTitles(titles) {
  return [...titles].sort((a, b) => {
    const yearA = Number.parseInt(a.Year, 10) || 0;
    const yearB = Number.parseInt(b.Year, 10) || 0;

    if (yearA !== yearB) {
      return yearB - yearA;
    }

    const ratingDifference =
      getWeightedRating(b) - getWeightedRating(a);

    if (Math.abs(ratingDifference) > 0.0001) {
      return ratingDifference;
    }

    return (b.VoteCount ?? 0) - (a.VoteCount ?? 0);
  });
}

export async function getTitleDetails(id, type) {
  const endpoint =
    type === "tv" ? `/tv/${id}` : `/movie/${id}`;

  return fetchTMDB(endpoint);
}

export async function fetchTrendingTitles(page = 1) {
  const data = await fetchTMDB("/trending/all/week", {
    page,
    include_adult: false,
  });

  return {
    results: data.results
      .filter(
        (item) =>
          item.media_type === "movie" ||
          item.media_type === "tv"
      )
      .map((item) => normalizeTitle(item, item.media_type)),
    totalPages: data.total_pages,
  };
}

export async function fetchPopularTitles(type, page = 1) {
  const endpoint =
    type === "tv" ? "/tv/popular" : "/movie/popular";

  const data = await fetchTMDB(endpoint, { page });

  return {
    results: data.results.map((item) =>
      normalizeTitle(item, type)
    ),
    totalPages: data.total_pages,
  };
}