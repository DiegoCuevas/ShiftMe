class RequestsController < ApplicationController

  def index
    render json: current_user.requester_request + current_user.requested_request
  end

  def update
    @request = Request.find_by(id: params[:id])
    if current_user.id != @request.requested_id
      render json: { errors: "You don't have access!!" }
    else 
      @request.status = params[:status]
      @request.save
      render json: @request
    end
  end
  
  def destroy
    @request = Request.find_by(id: params[:id])
    if current_user.id != @request.requested_id
      render json: { errors: "You don't have access!!" }
    else 
      @request.status = "Cancel"
      @request.save
      render json: @request
    end
  end

  def create 
    request = current_user.requester_request.new(request_params)
    if request.save
      render json: request, status: :created
    else
      render json: request.errors, status: :bad_request
    end



  private 
  def request_params
    params.permit(:rol, :creationDate, :date_Shift, :requested_id, :current_Shift_id, :requested_Shift_id )
  end
end
