import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Params, ParamMap } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SwipeDirective } from '../swipe.directive';

import { AuthService } from '../authentication/auth.service';
// import { mimeType } from '../';
import { ProfileService } from '../profile.service';
import { Profile } from '../profile.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  private profileId: string | null = '';
  isLoading = false;
  mode = 'create';
  editMode = false;
  profile: any;
  profiles: Profile[] = [];
  profileForm!: FormGroup;
  imagePreview: string = '';
  imagePreviewtwo: string | undefined;
  imagePreviewone: string | undefined;
  image: string = '';
  email: string = '';
  username = '';
  fullname: string = 'd';
  location: string = '';
  gender ='';
  interest = '';
  creator: string = '';
  // private authStatusSub: Subscription = new Subscription;
  // subscription: Subscription = new Subscription;
  profileEditUpdate: Subscription = new Subscription;
  subProfile: Subscription = new Subscription;
  id: any = undefined;
  cities: string | Array<string> = '';
  states = ["AK","TX", "CA", "MT", "NM", "AZ", "NV", "CO", "OR", "WY", "MI", "MN", "UT", "ID", "KS", "NE", "SD", "WA", "ND", "FL", "OK", "MO", "GA", "WI", "IL", "IA", "NY", "NC", "VA", "AR", "AL", "LA", "MS", "PA", "OH", "TN", "KY", "ME", "IN", "SC", "WV", "MD", "HA","MA", "VT", "NH", "NJ", "CT", "DE", "RI"	
];

constructor(
        private profileService: ProfileService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router) {
        }

  ngOnInit(): void  {
    this.email = localStorage.getItem('email')!
    this.profile = JSON.parse(sessionStorage.getItem('user')!)
    this.profileEditUpdate = this.profileService.getProfileEditListener().
      subscribe(returnedProfile => {
        const profile = {
          username: returnedProfile.username,
          email: returnedProfile.email,
          imagePath: returnedProfile.imagePath,
          location: returnedProfile.location,
          interest: returnedProfile.interest,
          gender: returnedProfile.gender,
          fullname: returnedProfile.fullname
        }
        console.log('got profile', profile)
        this.profile = profile;
        this.mode = 'edit';
        this.profileForm.patchValue(profile)     
      });
    this.profileForm = new FormGroup({
      'username': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      'email': new FormControl(this.email),
      'imagePath': new FormControl(null),
      'location': new FormControl(null),
      'interest': new FormControl(null),
      'gender': new FormControl(null, { validators: [Validators.required] }),
      'fullname': new FormControl(null),
    });
    this.username = sessionStorage.getItem('username') as string;
    if(this.username) {
      this.mode = 'edit';
    }
    this.email = localStorage.getItem('email') as string;
    this.creator = localStorage.getItem('userId') as string;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.profileId = paramMap.get('id')!;
      if (paramMap.has("id")) {
        this.mode === 'edit';
        this.profileId = paramMap.get('id')!;
        this.profile = this.profileService.getProfile2(this.profileId)
        this.imagePreview = this.profile.imagePath;
        this.profileForm!.setValue({ 
          username: this.username,
          email: this.profile!.email,
          imagePath: this.profile!.imagePath,
          location: this.profile!.location,
          interest: this.profile!.interest,
          gender: this.profile!.gender,
          fullname: this.profile!.fullname
        });
      } else {
        this.mode = 'create';
        this.profileId = null;
      }
    });
    // this.image = this.profile!.imagePath
    // console.log('imagepath', this.profile!.imagePath)
  }
  onSubmit() {
    console.log('profile uploads', this.profile?.imageGallery)
    sessionStorage.setItem('userId', this.profileId!);
    if (this.profileForm.invalid) {
        return;
    }
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.creator = this.authService.getUserId();
      this.profileService.updateProfile(
        this.profileId!, this.profileForm.value.username, this.profileForm.value.email, this.profileForm.value.imagePath, this.profileForm.value.location,
        this.profileForm.value.interest, this.profileForm.value.gender, this.profileForm.value.fullname,
        this.creator, null!, null!, null!, null!);
    } else {
        this.profileService.addProfile(
        this.profileForm.value.username, this.profileForm.value.location,
        this.profileForm.value.fullname, this.profileForm.value.email,
        this.profileForm.value.gender, this.profileForm.value.interest,
        this.profileForm.value.imagePath
        );
      }
      alert('Profile Saved')
  }
  onCancel() {
    this.router.navigate(['/']);
  }

  onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files![0];
  this.profileForm.patchValue({imagePath: file});
  this.profileForm.get('imagePath')!.updateValueAndValidity();
  const reader = new FileReader();
  reader.onload = () => {
    this.imagePreview = reader.result as string;
  };
  reader.readAsDataURL(file);
    }

  onNewProfile() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
  modeChange() {
    const username = sessionStorage.getItem('username');
    if(username != null) {
      this.mode = 'edit';      
    }
  }
  ngOnDestroy() {
    this.mode = 'create';
    this.subProfile.unsubscribe();
    this.profileEditUpdate.unsubscribe();
  }
  getCities(state: string) {
    switch(state) {
      case 'NJ':
        this.cities = [
          "Absecon",
          "Allamuchy-Panther Valley",
          "Allendale borough",
          "Allenhurst borough",
          "Allentown borough",
          "Allenwood",
          "Alloway",
          "Alpha borough",
          'Alpine borough',
          "Andover borough",
          "Annandale",
          'Asbury Park',
          "Ashland",
          "Atlantic City",
          "Atlantic Highlands borough",
          "Audubon borough",
          "Williamstown",
          "Berlin",
          "Clayton",
          "Clementon",
          "Glassboro"
        ]
        break;
      }
    }
  }
//           Audubon Park borough
//           Avalon borough
//           Avenel
//           Avon-by-the-Sea borough
//           Barclay-Kingston
//           Barnegat
//           Barnegat Light borough
//           Barrington borough
//           Bay Head borough
//           Bayonne
//           Beach Haven borough
//           Beach Haven West
//           Beachwood borough
//           Beatyestown
//           Beckett
//           Belford
//           Belleville
//           Bellmawr borough
//           Belmar borough
//           Belvidere
//           Bergenfield borough
//           Berkeley Heights
//           Berlin borough
//           Bernardsville borough
//           Beverly
//           Blackwood
//           Bloomfield
//           Bloomingdale borough
//           Bloomsbury borough
//           Bogota borough
//           Boonton
//           Bordentown
//           Bound Brook borough
//           Bradley Beach borough
//           Branchville borough
//           Brass Castle
//           Bridgeton
//           Brielle borough
//           Brigantine
//           Brooklawn borough
//           Browns Mills
//           Brownville
//           Budd Lake
//           Buena borough
//           Burlington
//           Butler borough
//           Caldwell borough
//           Califon borough
//           Camden
//           Cape May
//           Cape May Court House
//           Cape May Point borough
//           Carlstadt borough
//           Carneys Point
//           Carteret borough
//           Cedar Glen Lakes
//           Cedar Glen West
//           Cedar Grove
//           Cedarville
//           Chatham borough
//           Cherry Hill Mall
//           Chesilhurst borough
//           Chester borough
//           Clark
//           Clayton borough
//           Clearbrook Park
//           Clementon borough
//           Cliffside Park borough
//           Cliffwood Beach
//           Clifton
//           Clinton
//           Closter borough
//           Collings Lakes
//           Collingswood borough
//           Colonia
//           Concordia
//           Corbin City
//           Country Lake Estates
//           Cranbury
//           Crandon Lakes
//           Cranford
//           Cresskill borough
//           Crestwood Village
//           Dayton
//           Deal borough
//           Demarest borough
//           Diamond Beach
//           Dover
//           Dover Beaches North
//           Dover Beaches South
//           Dumont borough
//           Dunellen borough
//           East Brunswick
//           East Freehold
//           East Newark borough
//           East Orange
//           East Rutherford borough
//           Eatontown borough
//           Echelon
//           Edgewater borough
//           Edison
//           Egg Harbor City
//           Elizabeth
//           Elmer borough
//           Elmwood Park borough
//           Elwood-Magnolia
//           Emerson borough
//           Englewood
//           Englewood Cliffs borough
//           Englishtown borough
//           Erlton-Ellisburg
//           Erma
//           Essex Fells borough
//           Estell Manor
//           Ewing
//           Fairfield
//           Fair Haven borough
//           Fair Lawn borough
//           Fairton
//           Fairview borough
//           Fairview
//           Fanwood borough
//           Far Hills borough
//           Farmingdale borough
//           Fieldsboro borough
//           Flemington borough
//           Florence-Roebling
//           Florham Park borough
//           Folsom borough
//           Fords
//           Forked River
//           Fort Dix
//           Fort Lee borough
//           Franklin borough
//           Franklin Lakes borough
//           Freehold borough
//           Frenchtown borough
//           Garfield
//           Garwood borough
//           Gibbsboro borough
//           Gibbstown
//           Glassboro borough
//           Glendora
//           Glen Gardner borough
//           Glen Ridge borough
//           Glen Rock borough
//           Gloucester City
//           Golden Triangle
//           Great Meadows-Vienna
//           Greentree
//           Guttenberg
//           Hackensack
//           Hackettstown
//           Haddonfield borough
//           Haddon Heights borough
//           Haledon borough
//           Hamburg borough
//           Hammonton
//           Hampton borough
//           Harrington Park borough
//           Harrison
//           Harvey Cedars borough
//           Hasbrouck Heights borough
//           Haworth borough
//           Hawthorne borough
//           Heathcote
//           Helmetta borough
//           High Bridge borough
//           Highland Lake
//           Highland Park borough
//           Highlands borough
//           Hightstown borough
//           Hillsdale borough
//           Hillside
//           Hi-Nella borough
//           Hoboken
//           Ho-Ho-Kus borough
//           Holiday City-Berkeley
//           Holiday City South
//           Holiday Heights
//           Hopatcong borough
//           Hopewell borough
//           Interlaken borough
//           Irvington
//           Iselin
//           Island Heights borough
//           Jamesburg borough
//           Jersey City
//           Keansburg borough
//           Kearny
//           Kendall Park
//           Kenilworth borough
//           Keyport borough
//           Kingston
//           Kinnelon borough
//           Lakehurst borough
//           Lake Mohawk
//           Lake Telemark
//           Lakewood
//           Lambertville
//           Laurel Lake
//           Laurel Springs borough
//           Laurence Harbor
//           Lavallette borough
//           Lawnside borough
//           Lawrenceville
//           Lebanon borough
//           Leisure Knoll
//           Leisuretowne
//           Leisure Village
//           Leisure Village East
//           Leisure Village West-Pine Lake Park
//           Leonardo
//           Leonia borough
//           Lincoln Park borough
//           Lincroft
//           Linden
//           Lindenwold borough
//           Linwood
//           Little Falls
//           Little Ferry borough
//           Little Silver borough
//           Livingston
//           Loch Arbour village
//           Lodi borough
//           Long Branch
//           Longport borough
//           Long Valley
//           Lyndhurst
//           McGuire AFB
//           Madison borough
//           Madison Park
//           Magnolia borough
//           Manahawkin
//           Manasquan borough
//           Mantoloking borough
//           Manville borough
//           Maplewood
//           Margate City
//           Marlton
//           Matawan borough
//           Mays Landing
//           Maywood borough
//           Medford Lakes borough
//           Mendham borough
//           Mercerville-Hamilton Square
//           Merchantville borough
//           Metuchen borough
//           Middlesex borough
//           Midland Park borough
//           Milford borough
//           Millburn
//           Millstone borough
//           Milltown borough
//           Millville
//           Monmouth Beach borough
//           Monmouth Junction
//           Montclair
//           Montvale borough
//           Moonachie borough
//           Moorestown-Lenola
//           Morganville
//           Morris Plains borough
//           Morristown
//           Mountain Lakes borough
//           Mountainside borough
//           Mount Arlington borough
//           Mount Ephraim borough
//           Mullica Hill
//           Mystic Island
//           National Park borough
//           Navesink
//           Neptune City borough
//           Netcong borough
//           Newark
//           New Brunswick
//           New Egypt
//           Newfield borough
//           New Milford borough
//           New Providence borough
//           Newton
//           North Arlington borough
//           North Beach Haven
//           North Brunswick Township
//           North Caldwell borough
//           North Cape May
//           Northfield
//           North Haledon borough
//           North Middletown
//           North Plainfield borough
//           Northvale borough
//           North Wildwood
//           Norwood borough
//           Nutley
//           Oakhurst
//           Oakland borough
//           Oaklyn borough
//           Oak Valley
//           Ocean Acres
//           Ocean City
//           Ocean Gate borough
//           Ocean Grove
//           Oceanport borough
//           Ogdensburg borough
//           Old Bridge
//           Old Tappan borough
//           Olivet
//           Oradell borough
//           Orange
//           Oxford
//           Palisades Park borough
//           Palmyra borough
//           Paramus borough
//           Park Ridge borough
//           Passaic
//           Paterson
//           Paulsboro borough
//           Peapack and Gladstone borough
//           Pemberton borough
//           Pemberton Heights
//           Pennington borough
//           Pennsauken
//           Penns Grove borough
//           Pennsville
//           Perth Amboy
//           Phillipsburg
//           Pine Beach borough
//           Pine Hill borough
//           Pine Ridge at Crestwood
//           Pine Valley borough
//           Pitman borough
//           Plainfield
//           Plainsboro Center
//           Pleasantville
//           Point Pleasant borough
//           Point Pleasant Beach borough
//           Pomona
//           Pompton Lakes borough
//           Port Monmouth
//           Port Norris
//           Port Reading
//           Port Republic
//           Presidential Lakes Estates
//           Princeton borough
//           Princeton Junction
//           Princeton Meadows
//           Princeton North
//           Prospect Park borough
//           Rahway
//           Ramblewood
//           Ramsey borough
//           Ramtown
//           Raritan borough
//           Red Bank borough
//           Ridgefield borough
//           Ridgefield Park village
//           Ridgewood village
//           Ringwood borough
//           Rio Grande
//           Riverdale borough
//           River Edge borough
//           Riverton borough
//           River Vale
//           Rochelle Park
//           Rockaway borough
//           Rockleigh borough
//           Rocky Hill borough
//           Roosevelt borough
//           Roseland borough
//           Roselle borough
//           Roselle Park borough
//           Rosenhayn
//           Rossmoor
//           Rumson borough
//           Runnemede borough
//           Rutherford borough
//           Saddle Brook
//           Saddle River borough
//           Salem
//           Sayreville borough
//           Scotch Plains
//           Sea Bright borough
//           Seabrook Farms
//           Sea Girt borough
//           Sea Isle City
//           Seaside Heights borough
//           Seaside Park borough
//           Secaucus
//           Sewaren
//           Shark River Hills
//           Shiloh borough
//           Ship Bottom borough
//           Shrewsbury borough
//           Silver Ridge
//           Society Hill
//           Somerdale borough
//           Somerset
//           Somers Point
//           Somerville borough
//           South Amboy
//           South Belmar borough
//           South Bound Brook borough
//           South Orange
//           South Plainfield borough
//           South River borough
//           South Toms River borough
//           Spotswood borough
//           Springdale
//           Springfield
//           Spring Lake borough
//           Spring Lake Heights borough
//           Stanhope borough
//           Stockton borough
//           Stone Harbor borough
//           Stratford borough
//           Strathmere
//           Strathmore
//           Succasunna-Kenvil
//           Summit
//           Surf City borough
//           Sussex borough
//           Swedesboro borough
//           Tavistock borough
//           Teaneck
//           Tenafly borough
//           Teterboro borough
//           Tinton Falls borough
//           Toms River
//           Totowa borough
//           Trenton
//           Tuckerton borough
//           Turnersville
//           Twin Rivers
//           Union
//           Union Beach borough
//           Union City
//           Upper Saddle River borough
//           Ventnor City
//           Vernon Valley
//           Verona
//           Victory Gardens borough
//           Victory Lakes
//           Villas
//           Vineland
//           Vista Center
//           Waldwick borough
//           Wallington borough
//           Wanamassa
//           Wanaque borough
//           Waretown
//           Washington borough
//           Washington Township
//           Watchung borough
//           Wayne
//           Wenonah borough
//           West Belmar
//           West Caldwell
//           West Cape May borough
//           Westfield
//           West Freehold
//           West Long Branch borough
//           West Milford
//           West New York
//           West Orange
//           West Paterson borough
//           Westville borough
//           West Wildwood borough
//           Westwood borough
//           Wharton borough
//           White Horse
//           White House Station
//           White Meadow Lake
//           Whitesboro-Burleigh
//           Whittingham
//           Wildwood
//           Wildwood Crest borough
//           Williamstown
//           Woodbine borough
//           Woodbridge
//           Woodbury
//           Woodbury Heights borough
//           Woodcliff Lake borough
//           Woodlynne borough
//           Wood-Ridge borough
//           Woodstown borough
//           Wrightstown borough
//           Wyckoff
//           Yardville-Groveville
//           Yorketown]
//     }
//   }
//   states = ["AK","TX", "CA", "MT", "NM", "AZ", "NV", "CO", "OR", "WY", "MI", "MN", "UT", "ID", "KS", "NE", "SD", "WA", "ND", "FL", "OK", "MO", "GA", "WI", "IL", "IA", "NY", "NC", "VA", "AR", "AL", "LA", "MS", "PA", "OH", "TN", "KY", "ME", "IN", "SC", "WV", "MD", "HA","MA", "VT", "NH", "NJ", "CT", "DE", "RI"	
// ];
// }
