Endpoints
--------

----

# User /api/v1

me GET /me

login POST /sign_in

### Parameters
```
sign_in:
    :email,
    :password
```

# Leads /api/v1

index GET /leads.json

show GET /leads/:id

new GET /leads/new (instructions)

create POST /leads

### Parameters
```
leads:
    :first_name,
    :last_name,
    :email,
    :phone,
    :mobile,
    :created_at,
    :updated_at,
    :address,
    :city,
    :state,
    :zip,
    :ticket_subject,
    :ticket_description,
    :ticket_problem_type,
    :ticket_id,
    :customer_id,
    :contact_id
```

# Customers /api/v1

index GET /customers.json

Also supports search, pass a parameter named "query" to do a search

show GET /customers/:id

new GET /customers/new (instructions)

create POST /customers

update PUT /customers/:id

autocomplete GET /customers/autocomplete (with param query=STRING)

### Parameters

```
customers:
    :customer_id,
    :business_name,
    :firstname,
    :lastname,
    :email,
    :phone,
    :mobile,
    :address,
    :address_2,
    :city,
    :state,
    :zip,
    :notes,
    :get_sms,
    :opt_out,
    :no_email
```

# Invoices /api/v1

index GET /invoices.json

new GET /invoices/new (instructions)

create POST /invoices

### Parameters
```
invoices:
    :number,
    :date,
    :customer_id,
    :employee,
    :date_received,
    :ticket_id,
    :took_payment,
    :paid,
    :location_id
    :line_items [
        :item,
        :name, :
        quantity,
        :cost,
        :price,
        :taxable
    ]
```

# Payment Methods /api/v1
index GET /payment_methods

# Tickets /api/v1
index GET /tickets.json (optional; customer_id, number, status=Not Closed)

show GET /tickets/:id

new GET /tickets/new (instructions)

create POST /tickets

update PUT /tickets/:id

add comment POST /tickets/(:number or :id)/comment

### Parameters
```
comments:
    :subject,
    :body,
    :hidden,
    :sms_body,
    :do_not_email
```
hidden/do_not_email should be '0' or '1'
```
tickets:
    :number,
    :subject,
    :created_at,
    :customer_id,
    :due_date,
    :start_at,
    :end_at,
    :location_id,
    :problem_type,
    :status,
    :user_id
```

__NEW__: Now you can send the comment in a simpler way by using these attributes:
```
tickets:
    :comment_body,
    :comment_subject,
    :comment_tech,
    :comment_do_not_email,
    :comment_hidden,
    :comment_sms_body
```
__Key__:

*  Body: The message body
*  Tech: a friendly name to show in the tech field
*  Do Not Email: boolean, send a 1 or 0 for if we should email the customer or not
*  Hidden: send a 1 or 0 for if this is a private comment
*  SMS Body: the body to get sent to customer via SMS


Sample CURL
```
curl --data "api_key=YOUR_KEY_HERE&customer_id=3411&subject=testing&problem_type=Virus&status=New&comment_subject=Update&comment_body=I am the body" http://demo.repairshopr.com/api/v1/tickets
```

# Products /api/v1
index GET /products

Also supports search, pass a param named "sku" to search for a SKU, or pass a param named "query" to do a text search

show GET /products/:id

new GET /products/new (instructions)

create POST /products

update LocationQuantity (big chain inventory levels) PUT /products/:id/location_quantities (needs location_quantity_id & quantity params)

### Parameters

```
product:
    :price_cost,
    :price_retail,
    :condition,
    :description,
    :maintain_stock,
    :name,
    :quantity,
    :warranty,
    :sort_order,
    :reorder_at,
    :disabled,
    :taxable,
    :product_category,
    :upc_code,
    :discount_percent,
    :warranty_template_id,
    :qb_item_id,
    :vendor_id,
    :desired_stock_level,
    :price_wholesale,
    :notes,
    :tax_rate_id,
    :physical_location,
    :serialized
```

# Appointments /api/v1
index GET /appointments

Optional param named "mine" will filter to the current user

show GET /appointments/:id

# Assets /api/v1

index GET /customer_assets

*  customer_id - filters by a customer_id
*  asset_type_id - filters by asset_type
*  query - does a text search

show GET /customer_assets/:id

create POST /customer_assets

update PUT /customer_assets/:id

### Parameters
```
assets:
    :name,
    :created_at,
    :updated_at,
    :customer_id,
    :asset_serial,
    :asset_type_id
```

#Payments /api/v1

index GET /payments

show GET /payments/:id

create POST /payments

update PUT /payments/:id

### Parameters
```
payments:
    :invoice_id,
    :invoice_number,
    :amount_cents,
    :first_name,
    :last_name,
    :address_street,
    :address_city,
    :address_zip,
    :ref_num,
    :register_id,
    :signature_name,
    :signature_data
```