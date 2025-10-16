import { IEventQueryParams } from "../types/events.types";

export function buildEventFilters(queryParams: IEventQueryParams) {
  const query: Record<string, any> = {};
  if (queryParams.category) query.category = queryParams.category;
  if (queryParams.location)
    query.location = {
      $regex: queryParams.location,
      $options: "i",
    };
  if (queryParams.dateFrom || queryParams.dateTo) {
    query.date = {};
    if (queryParams.dateFrom) {
      query.date.$gte = new Date(queryParams.dateFrom);
    }
    if (queryParams.dateTo) {
      query.date.$lte = new Date(queryParams.dateTo);
    }
  }
  if (queryParams.search) {
    query.$or = [
      { title: { $regex: queryParams.search, $options: "i" } },
      { description: { $regex: queryParams.search, $options: "i" } },
    ];
  }
  if (queryParams.sortBy) {
    query.sort = {
      [queryParams.sortBy]: queryParams.order,
    };
  }
  return query;
}

export function buildPagination(page: string, limit: string, total: number) {
  const currentPage = parseInt(page) || 1;
  let itemsPerPage = parseInt(limit) || 10;
  if (itemsPerPage > 100) itemsPerPage = 100;
  if (itemsPerPage < 1) itemsPerPage = 10;

  const skip = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(total / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    itemsPerPage,
    skip,
    totalPages,
    total,
    hasNextPage,
    hasPrevPage,
  };
}
