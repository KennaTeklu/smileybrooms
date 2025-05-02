package com.smileybrooms.app.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.smileybrooms.app.R
import com.smileybrooms.app.models.Service

class ServiceAdapter(
    private val services: List<Service>,
    private val onServiceClicked: (Service) -> Unit
) : RecyclerView.Adapter<ServiceAdapter.ServiceViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ServiceViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_service, parent, false)
        return ServiceViewHolder(view)
    }

    override fun onBindViewHolder(holder: ServiceViewHolder, position: Int) {
        holder.bind(services[position])
    }

    override fun getItemCount(): Int = services.size

    inner class ServiceViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val iconImageView: ImageView = itemView.findViewById(R.id.service_icon)
        private val nameTextView: TextView = itemView.findViewById(R.id.service_name)
        private val descriptionTextView: TextView = itemView.findViewById(R.id.service_description)
        private val priceTextView: TextView = itemView.findViewById(R.id.service_price)
        private val bookButton: Button = itemView.findViewById(R.id.book_service_button)

        fun bind(service: Service) {
            iconImageView.setImageResource(service.iconResId)
            nameTextView.text = service.name
            descriptionTextView.text = service.description
            priceTextView.text = service.price
            
            bookButton.setOnClickListener {
                onServiceClicked(service)
            }
        }
    }
}
