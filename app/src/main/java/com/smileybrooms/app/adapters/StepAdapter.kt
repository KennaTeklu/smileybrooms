package com.smileybrooms.app.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.smileybrooms.app.R
import com.smileybrooms.app.models.Step

class StepAdapter(private val steps: List<Step>) : RecyclerView.Adapter<StepAdapter.StepViewHolder>() {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): StepViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_step, parent, false)
        return StepViewHolder(view)
    }

    override fun onBindViewHolder(holder: StepViewHolder, position: Int) {
        holder.bind(steps[position])
    }

    override fun getItemCount(): Int = steps.size

    class StepViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val numberTextView: TextView = itemView.findViewById(R.id.step_number)
        private val titleTextView: TextView = itemView.findViewById(R.id.step_title)
        private val descriptionTextView: TextView = itemView.findViewById(R.id.step_description)

        fun bind(step: Step) {
            numberTextView.text = step.number
            titleTextView.text = step.title
            descriptionTextView.text = step.description
        }
    }
}
