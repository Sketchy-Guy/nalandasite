from rest_framework.pagination import PageNumberPagination


class LargeResultsSetPagination(PageNumberPagination):
    """
    Custom pagination class that allows larger page sizes.
    Default page size is 20, but can be overridden up to 1000 items.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000
