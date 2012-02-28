module UserSystem	
  def user_permitted?(*permissions)
    return false if !logged_in? 
    roles = User.find_by_id(session[:user]).roles
    for p in permissions
    	if roles.include?(p.to_s)
    		return true
    	end
    end
    return false
  end
  protected

  # method/filter to check permissions for all or single action
  def permission_required(*permissions)
    # if no permissions passed use controller level permissions (filter)
    if permissions.size > 0
    return true if user_permitted?(*permissions)
    # redirect to desired location when user does not have permission
    redirect_to :controller => 'main', :action => 'main' 
    return
	end
  end
  
end
