using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace myVegAppDbAPI.Model.Enums
{
    [Flags]
    public enum DishTipology
    {
        None = 0,
        Vegetarian = 1,
        Vegan = 2,
        GlutenFree = 4,
        EggFree = 8
    }
     
}
