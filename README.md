# MetaRealm

Tool for easily using Realm with schemas that are not known until runtime, e.g. user-defined schemas

## WHY

Realm is great! If there is no need to share content between users, then a local Realm instance and the structure of the data to be stored is all that is needed.\
Often, apps aim to generalize their use case to be more accessible to a wider audience, especially "progress" and "daily tracking" apps.\
<b>Maybe the user should be able to define the structure of the data they want to track.</b>
<br/>
In this case, the Realm schemas are not known until the user defines them at runtime, so a Realm cannot be readily opened, and a solution for saving these "dynamic" schemas must be implemented.

## WHAT

DynamicRealm was made to solve this problem.
<b>DynamicRealm allows users to save any number of data structures (Realm schemas), while developers can use DynamicRealm to simply "load" realms with a set of these dynamic schemas.</b>

## HOW

#### Installation

Install via NPM:

```bash
npm install @asianpersonn/metarealm
```
