import { Component, OnInit } from '@angular/core';
import { MiscService } from './_service/misc.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import swal from 'sweetalert2';
@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.css']
})
export class MiscComponent implements OnInit {

  tableItems = [];
  selected = [];
  updateForm: FormGroup;
  constructor(
    private miscService: MiscService,
    private formBuilder: FormBuilder,
    
  ) {

    this.getAllData();
    this.updateForm = this.formBuilder.group({
      cost : '',
    })

  }

  ngOnInit() {
  }

  getAllData() {
    this.miscService.getAllData().subscribe(data => {
      if (data['success'] == true) {
         this.tableItems = [];
         delete data['data'][0]['id'];
        for(let item in data['data'][0]){
          this.tableItems.push([item,data['data'][0][item]]);
        }
      }
    });
  }

  onEditClick(i){
    this.selected = this.tableItems[i];
    this.updateForm = this.formBuilder.group({
      cost:this.selected[1]
    });
  }

  onEdit(value){
    let newData = {[this.selected[0]]:value.cost};
    this.miscService.update(newData).subscribe(data=>{
      if (data['success'] === true) {
        swal.fire('Success', data['message'], 'success');
        this.getAllData();
      } else if (data['success'] === false) {
        swal.fire('Oops', data['message'], 'error');
      }
    })
  }
}
