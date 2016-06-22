from rest_framework import permissions


class IsStaffOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff members to edit object.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.user and request.user.is_staff:
            return True
        
        return False


class IsStaffOrCreateOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff members to list
    and retrieve object, and allow anybody to create new
    """

    def has_permission(self, request, view):
        # Create permissions are allowed to any request,
        # so we'll always allow POST, HEAD or OPTIONS requests.
        # admin user can GET or DELETE but can't PUT or PATCH resource
        ALLOWED_METHODS = ('POST', 'HEAD', 'OPTIONS')
        ADMIN_ALLOWED_METHODS = ('GET', 'DELETE')
        if request.method in ALLOWED_METHODS:
            return True
        if (request.user and request.user.is_staff and
                request.method in ADMIN_ALLOWED_METHODS):
            return True
        
        return False



class IsWeblogAuthor(permissions.BasePermission):
    """
    Custom permission to allow only weblog authors to access
    an object.
    """

    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated() and 
                request.user.is_weblog_author)



class IsWeblogAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow staff members or weblog authors
    to create object.
    """

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        return (request.method in permissions.SAFE_METHODS or
            request.user and request.user.is_authenticated() and
            request.user.is_weblog_author)



class IsAuthorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow author to edit an object.
    Assumes the model instance has an `author` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Instance must have an attribute named `author`.
        return obj.author == request.user


