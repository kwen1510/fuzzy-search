function compareString() {

  var schoolStaffList = true

  var mainSheet = "Sheet1"

  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(mainSheet)
  var cannotFindSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Cannot Find")

  // Clear cannotFindSheet
  cannotFindSheet.clear()

  // Clear matched data
  ss.getRange("C2:C1000").clearContent()


  var lastRow = ss.getLastRow()

  // console.log(lastRow)
  
  var data = ss.getRange(2,1,lastRow,2).getValues()

  // console.log(data)

  // Create an array with all the names in my list to compare with
  var myArray = data.map(element => {
    return element[0]
  })

  // Remove all blank array in referenceArray
  myArray = myArray.filter(n => n)


  // Create an array with all names to compare with
  var referenceArray = data.map(element => {
    return element[1]
  })

  // Remove all blank array in referenceArray
  referenceArray = referenceArray.filter(n => n)


  // Duplicate referenceArray
  var referenceArrayDup = referenceArray

  ////// This chunk of code is specific to the school list /////////

  if(schoolStaffList == true){

    // Remove all items within paranthesis (e.g. (Year Head))
    referenceArray = referenceArray.map(element => {
      return element.replaceAll(/ *\([^)]*\) */g, "")
    })

    // Remove all text after '- Mrs'
    referenceArray = referenceArray.map(element =>{
      return element.split('- M')[0]
    })

    // Replace all ',' with ''
    referenceArray = referenceArray.map(element =>{
      return element.replaceAll(",", "")
    })  

    // Replace all ' - ' with ''
    referenceArray = referenceArray.map(element =>{
      return element.replaceAll(" - ", " ")
    })      

    // Replace all '-' with ''
    referenceArray = referenceArray.map(element =>{
      return element.replaceAll("-", " ")
    })    

    // Replace all "'" with '' (e.g. Run’Er)
    referenceArray = referenceArray.map(element =>{
      return element.replaceAll("’", " ")
    })    

    // Replace all white spaces at the start and end
    referenceArray = referenceArray.map(element =>{
      return element.trim()
    })    

  }

  ////////////////////////////////////////////////////////////////////

  console.log("Reference Array")
  console.log(referenceArray)

  for(var a = 0; a < myArray.length; a++){

    // Get the first name
    var nameOne = myArray[a]

    // Duplicate this to append in "Cannot Find"
    var nameOneDup = nameOne

    /////// Clean up main text ///////////////

    // Remove all items within paranthesis (e.g. (Year Head))
    nameOne = nameOne.replaceAll(/ *\([^)]*\) */g, "")

    // Remove all text after '- Mrs'
    nameOne = nameOne.split('- M')[0]

    // Replace all ' - ' with '' 
    nameOne = nameOne.replaceAll(" - ", " ")

    // Replace all "-" with " " 
    nameOne = nameOne.replaceAll("-", " ")

    // Replace all ',' with ''
    nameOne = nameOne.replaceAll(",", "")

    // Replace all ',' with '' 
    nameOne = nameOne.replaceAll("’", " ")

    // Set all to lowercase
    nameOne = nameOne.toLowerCase()

    // Replace all white spaces at the start and end
    nameOne = nameOne.trim()

    ///////////////////////////////////////////////

    // Assume I cannot find the first name
    var status = "Cannot find"

    var nameOneArray = nameOne.split(" ")

    // Remove blank strings
    nameOneArray = nameOneArray.filter(n => n)
    console.log(nameOneArray)

    var nameLength = nameOneArray.length
    console.log("Length of name: " + nameLength)

    // Loop through referenceArray
    for(var reference of referenceArray){

      var refName = reference

      // Set all to lowercase
      reference = reference.toLowerCase()

      reference = reference.split(" ")

      // Get length of reference string
      var refLength = reference.length
      // console.log("Reference length: " + refLength)

      //Get an array of their intersections
      const intersection = reference.filter(value => nameOneArray.includes(value));

      // console.log("Intersection: " + intersection)
      console.log("Ref: " + reference)
      console.log("Name: " + nameOneArray)

      var intersectionLength = intersection.length

      // console.log(intersectionLength)

      if(intersectionLength == refLength || intersectionLength == nameLength){
        
        console.log("Name exists!")

        // Get actual name from referenceArrayDup
        var refIndex = referenceArray.indexOf(refName)

        console.log(refIndex)

        var refNameFull = referenceArrayDup[refIndex]

        console.log(refNameFull)

        // Set value in cell
        var rowNum = a + 2
        ss.getRange(rowNum, 3).setValue(refNameFull)

        // Change status
        status = "Found"


      }

      // If found, exit loop and move to next name
      if(status == "Found"){console.log("Finding next name"); break;}

      }

      // If status == "Cannot find", check if name is conjoined
      if(status == "Cannot find"){
        console.log("Split into smaller chunks")

        // Remove all spaces
        nameOne = nameOne.replaceAll(" ", "")

        // To lower case
        nameOne = nameOne.toLowerCase()

        // Split into individual character
        var splitNameOne = nameOne.split("")

        // Remove all blanks
        splitNameOne = splitNameOne.filter(n => n)

        console.log(splitNameOne)

        // Redefine reference as refName
        var reference = refName

        // To lower case
        reference = reference.toLowerCase()

        // Do the same things for reference
        reference = reference.replaceAll(" ", "")

        // Split into individual character
        var splitReference = reference.split("")

        // Remove all blanks
        splitReference = splitReference.filter(n => n);

        console.log(splitReference)

        // Get the intersection
        const splitIntersection = splitReference.filter(value => splitNameOne.includes(value));

        // Compare lengths of array and lengths of intersects again
        var referenceLength = splitReference.length
        var splitNamelength = splitNameOne.length
        var splitIntersectionLength = splitIntersection.length

        if(referenceLength == splitIntersectionLength || splitNamelength == splitIntersectionLength){

          console.log("Found it!") 


          // Get actual name from referenceArrayDup
          var refIndex = referenceArray.indexOf(refName)

          console.log(refIndex)

          var refNameFull = referenceArrayDup[refIndex]

          console.log(refNameFull)

          // Add to the correct row
          var rowNum = a + 2
          ss.getRange(rowNum, 3).setValue(refNameFull)

          // Change status
          status = "Found"
          break;

        }

    }

    // Before I move to the next name, if I cannot find it, append to "cannot find" sheet
    if(status == "Cannot find"){
      cannotFindSheet.appendRow([nameOneDup])
    }

  }

}



/*

  **Algorithm**

  - Compare two arrays
  - Remove chunk from both arrays if it exists
  - As long as one array length = 0; that means it is the correct name
  - Highlight just to be sure (for checking)

*/
