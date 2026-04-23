import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/axios";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const PILLS = ["All", "Lipgloss", "Body Splash"];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [showFilters, setShowFilters] = useState(false);

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentCategory = searchParams.get("category") || "";
  const currentMin = searchParams.get("minPrice") || "";
  const currentMax = searchParams.get("maxPrice") || "";
  const currentSort = searchParams.get("sort") || "";

  useEffect(() => {
    api
      .get("/products/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    api
      .get(`/products?${params}`)
      .then(({ data }) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setPages(data.pages || 1);
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
        setPages(1);
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  const setParam = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    if (key !== "page") p.delete("page");
    setSearchParams(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setParam("keyword", keyword);
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      {/* Hero banner */}
      <section className="bg-burgundy-800 text-cream-50 py-20 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold-400 mb-3">
            Our Products
          </p>
          <h1 className="font-display text-5xl lg:text-6xl leading-tight">
            The <span className="italic">Beauty</span> Catalog
          </h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-3xl text-burgundy-900">
              {currentCategory || "All Products"}
            </h2>
            <p className="text-sm text-burgundy-900/60 mt-1">
              {total} products found
            </p>
          </div>
          <div className="flex gap-3">
            <form onSubmit={handleSearch} className="flex">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search..."
                className="bg-cream-50 border border-cream-200 px-4 py-2 text-sm focus:outline-none focus:border-burgundy-700 w-48"
              />
              <button
                type="submit"
                className="bg-burgundy-700 text-cream-50 px-4 py-2 hover:bg-burgundy-800 transition-colors"
              >
                <MagnifyingGlassIcon className="w-4 h-4" />
              </button>
            </form>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border border-cream-300 px-4 py-2 text-sm text-burgundy-900 hover:border-burgundy-700 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="bg-cream-100 border border-cream-200 p-6 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">
                Category
              </label>
              <select
                value={currentCategory}
                onChange={(e) => setParam("category", e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 px-3 py-2 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">
                Min Price
              </label>
              <input
                type="number"
                value={currentMin}
                onChange={(e) => setParam("minPrice", e.target.value)}
                placeholder="EGP 0"
                className="w-full bg-cream-50 border border-cream-300 px-3 py-2 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">
                Max Price
              </label>
              <input
                type="number"
                value={currentMax}
                onChange={(e) => setParam("maxPrice", e.target.value)}
                placeholder="Any"
                className="w-full bg-cream-50 border border-cream-300 px-3 py-2 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-[0.25em] text-gold-600 mb-2">
                Sort By
              </label>
              <select
                value={currentSort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="w-full bg-cream-50 border border-cream-300 px-3 py-2 text-sm text-burgundy-900 focus:outline-none focus:border-burgundy-700"
              >
                <option value="">Featured</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-10">
          {PILLS.map((c) => {
            const active =
              c === "All" ? !currentCategory : currentCategory === c;
            return (
              <button
                key={c}
                onClick={() => setParam("category", c === "All" ? "" : c)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                  active
                    ? "bg-burgundy-800 text-cream-50"
                    : "bg-cream-100 text-burgundy-900 hover:bg-cream-200"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-burgundy-900/60 font-display italic text-2xl">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-center mt-14 gap-2">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setParam("page", p)}
                className={`w-10 h-10 text-sm font-medium transition-colors ${
                  currentPage === p
                    ? "bg-burgundy-800 text-cream-50"
                    : "bg-cream-100 text-burgundy-900 hover:bg-cream-200"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
