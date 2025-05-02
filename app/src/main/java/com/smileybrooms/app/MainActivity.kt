package com.smileybrooms.app

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.button.MaterialButton
import com.smileybrooms.app.adapters.ServiceAdapter
import com.smileybrooms.app.adapters.StepAdapter
import com.smileybrooms.app.models.Service
import com.smileybrooms.app.models.Step

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        setupServicesList()
        setupStepsList()
        setupButtons()
    }
    
    private fun setupServicesList() {
        val servicesList = findViewById<RecyclerView>(R.id.services_recycler_view)
        servicesList.layoutManager = LinearLayoutManager(this, LinearLayoutManager.HORIZONTAL, false)
        
        val services = listOf(
            Service(
                "Regular Cleaning",
                "Our standard cleaning service for homes that need regular maintenance.",
                R.drawable.ic_regular_cleaning,
                "$120"
            ),
            Service(
                "Deep Cleaning",
                "Thorough cleaning for homes that need extra attention to detail.",
                R.drawable.ic_deep_cleaning,
                "$220"
            ),
            Service(
                "Move In/Out Cleaning",
                "Comprehensive cleaning for when you're moving in or out of a property.",
                R.drawable.ic_move_cleaning,
                "$320"
            ),
            Service(
                "Office Cleaning",
                "Professional cleaning services for office spaces and commercial properties.",
                R.drawable.ic_office_cleaning,
                "Custom"
            )
        )
        
        servicesList.adapter = ServiceAdapter(services) { service ->
            Toast.makeText(this, "Selected: ${service.name}", Toast.LENGTH_SHORT).show()
        }
    }
    
    private fun setupStepsList() {
        val stepsList = findViewById<RecyclerView>(R.id.steps_recycler_view)
        stepsList.layoutManager = LinearLayoutManager(this)
        
        val steps = listOf(
            Step(
                "01",
                "Calculate Your Price",
                "Use our easy price calculator to get an instant quote based on your specific cleaning needs."
            ),
            Step(
                "02",
                "Book Your Service",
                "Select a date and time that works for you and provide your address and access details."
            ),
            Step(
                "03",
                "Get Matched",
                "We'll match you with a professional cleaner who specializes in your requested services."
            ),
            Step(
                "04",
                "Enjoy a Clean Space",
                "Relax while our professionals clean your space to perfection, with a 100% satisfaction guarantee."
            )
        )
        
        stepsList.adapter = StepAdapter(steps)
    }
    
    private fun setupButtons() {
        val calculatePriceButton = findViewById<MaterialButton>(R.id.calculate_price_button)
        calculatePriceButton.setOnClickListener {
            Toast.makeText(this, "Calculate Price clicked", Toast.LENGTH_SHORT).show()
            // In a real app, navigate to the price calculator
        }
        
        val joinWaitlistButton = findViewById<MaterialButton>(R.id.join_waitlist_button)
        joinWaitlistButton.setOnClickListener {
            Toast.makeText(this, "Join Waitlist clicked", Toast.LENGTH_SHORT).show()
            // In a real app, show the waitlist dialog
        }
    }
}
