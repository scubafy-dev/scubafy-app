"use client"

// This is a template for implementing center-specific data loading in page components
// Replace ComponentName, dataType, mockDataImport, etc. with actual values

import { useState, useEffect } from "react"
import { useDiveCenter } from "@/lib/dive-center-context"
// Import your mock data for this component
import { dataByCenter, allData, DataType } from "@/lib/mock-data/your-data-file"

export function ComponentName() {
  // Get the current center context
  const { currentCenter, isAllCenters, getCenterSpecificData } = useDiveCenter()
  
  // State to hold the center-specific data
  const [data, setData] = useState<DataType[]>([])
  
  // Update data when center changes
  useEffect(() => {
    // Use the getCenterSpecificData helper to get the right data for the current center
    const centerData = getCenterSpecificData(dataByCenter, allData)
    if (centerData) {
      setData(centerData)
    }
  }, [currentCenter, isAllCenters, getCenterSpecificData])
  
  return (
    <div>
      {/* Display information about which center's data is being shown */}
      <h2 className="text-lg font-semibold">
        {isAllCenters 
          ? "Data for All Centers" 
          : `Data for ${currentCenter?.name}`}
      </h2>
      
      {/* Use the data in your component */}
      {data.length > 0 ? (
        <div>
          {/* Render your data */}
          {data.map(item => (
            <div key={item.id}>
              {/* Display item details */}
            </div>
          ))}
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  )
}

/*
INSTRUCTIONS FOR UPDATING COMPONENTS TO SUPPORT CENTER-SPECIFIC DATA:

1. In each mock data file:
   - Use center IDs as keys (e.g., "dauin", "malapascua", etc.) not center names
   - Import dive center data if needed for mapping IDs to names
   - For "all centers" data, add center names to the items

2. In each component:
   - Import useDiveCenter from "@/lib/dive-center-context" 
   - Set up a state variable to hold the data for the current center
   - Use the useEffect hook to update data when the center changes
   - Display information about which center's data is being shown

3. For pages with subcomponents:
   - Either pass the center-specific data down as props
   - Or have each subcomponent use useDiveCenter directly

4. When testing:
   - Switch between different centers and verify the data changes
   - Check the "All Centers" view to ensure all data is displayed correctly
*/ 